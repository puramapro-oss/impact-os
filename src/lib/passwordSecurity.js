// Used only to detect a different session. The provider still verifies the
// token and authorizes every request; decoding these claims grants no access.
export function securitySessionIdentity(session) {
  try {
    const payload = session.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const claims = JSON.parse(atob(payload));
    return claims.sub === session.user?.id && claims.session_id
      ? `${claims.sub}:${claims.session_id}` : null;
  } catch {
    return null;
  }
}

const interrupted = () => new Error('La session a changé. Rouvrez cet écran pour continuer.');

export function createPasswordSecurity({ session, getCurrentSession, createClient, userId }) {
  let active = true;
  const capturedIdentity = securitySessionIdentity(session);
  const tokens = { access_token: session?.access_token, refresh_token: session?.refresh_token };
  let clientPromise;
  let scopedClient;
  let verifiedUser;
  let busy = false;
  const abort = new AbortController();
  const check = () => {
    if (!active || !capturedIdentity || securitySessionIdentity(getCurrentSession()) !== capturedIdentity) {
      active = false;
      abort.abort();
      throw interrupted();
    }
  };

  async function request(input, init) {
    check();
    const url = new URL(typeof input === 'string' ? input : input.url);
    // This isolated client must never rotate the shared session's refresh token.
    if (url.searchParams.get('grant_type') === 'refresh_token') {
      // A local, non-retryable refusal also stops the SDK's refresh retry loop.
      return new Response(JSON.stringify({ code: 'session_not_found', message: 'Reconnectez-vous avant de réessayer.' }), {
        status: 401, headers: { 'Content-Type': 'application/json', 'X-Supabase-Api-Version': '2024-01-01' },
      });
    }
    const token = new Headers(init?.headers || input.headers).get('authorization')?.replace(/^Bearer\s+/i, '');
    if (securitySessionIdentity({ access_token: token, user: { id: userId } }) !== capturedIdentity) throw interrupted();
    const result = await fetch(input, { ...init, signal: abort.signal });
    check();
    return result;
  }

  async function open() {
    check();
    if (!clientPromise) clientPromise = (async () => {
      if (session?.user?.id !== userId || !capturedIdentity) throw interrupted();
      const client = createClient(request);
      scopedClient = client;
      let restored;
      try {
        // setSession verifies the token with getUser on this isolated client.
        // Never call the shared client's getUser: a late session_not_found can
        // otherwise remove an account that signed in while that request ran.
        restored = await client.setSession(tokens);
      } finally {
        // SDK initialization adds a visibility listener even with auto-refresh
        // disabled. Remove it after initialization, including failed restores.
        await client.stopAutoRefresh();
      }
      check();
      if (restored?.error || securitySessionIdentity(restored?.data?.session) !== capturedIdentity) {
        throw new Error('La session ne peut pas être vérifiée. Reconnectez-vous.');
      }
      verifiedUser = restored.data.session.user;
      return client;
    })().catch(error => { clientPromise = null; throw error; });
    return clientPromise;
  }

  async function execute(action) {
    check();
    if (busy) throw new Error('Une opération de sécurité est déjà en cours.');
    busy = true;
    try {
      const client = await open();
      check();
      return await action(client);
    } finally {
      busy = false;
    }
  }

  return {
    isActive: () => active,
    dispose() {
      active = false;
      abort.abort();
      void scopedClient?.stopAutoRefresh();
      scopedClient = null;
      clientPromise = null;
      verifiedUser = null;
    },
    async status() {
      await open();
      check();
      if (verifiedUser.factors !== undefined && !Array.isArray(verifiedUser.factors)) throw new Error('Facteurs de sécurité non vérifiés.');
      return { factors: verifiedUser.factors || [] };
    },
    async requestCode() {
      return execute(async client => {
        const result = await client.reauthenticate();
        check();
        if (!result || result.error) throw new Error('Le code de confirmation n’a pas pu être envoyé. Réessayez.');
      });
    },
    async changePassword({ currentPassword, password, confirmation, nonce }) {
      if (!currentPassword || password.length < 8 || password !== confirmation || password === currentPassword) {
        throw new Error('Vérifiez le mot de passe actuel et les deux nouveaux mots de passe : au moins huit caractères, différents du précédent.');
      }
      return execute(async client => {
        const result = await client.updateUser({ current_password: currentPassword, password, ...(nonce ? { nonce: nonce.trim() } : {}) });
        check();
        if (['reauthentication_needed', 'reauthentication_not_valid'].includes(result?.error?.code)) {
          return { needsNonce: true, invalidNonce: result.error.code === 'reauthentication_not_valid' };
        }
        if (result?.error?.code === 'insufficient_aal') throw new Error('Une session avec double authentification est requise par le fournisseur.');
        if (result?.error || result?.data?.user?.id !== userId) {
          throw new Error('Changement non confirmé. Vérifiez les champs et votre connexion avant de réessayer.');
        }
        return { changed: true };
      });
    },
  };
}
