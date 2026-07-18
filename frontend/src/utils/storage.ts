const TOKEN_KEY = "supportflow_token";
const USUARIO_KEY = "supportflow_usuario";

export const guardarSesion = (token: string, usuario: string, recordar: boolean) => {
    const storage = recordar ? localStorage : sessionStorage;
    const storageContrario = recordar ? sessionStorage : localStorage;

    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USUARIO_KEY, usuario);

    storageContrario.removeItem(TOKEN_KEY);
    storageContrario.removeItem(USUARIO_KEY);
};

export const obtenerToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const obtenerUsuario = (): string | null => {
    return localStorage.getItem(USUARIO_KEY) || sessionStorage.getItem(USUARIO_KEY);
};

export const limpiarSesion = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USUARIO_KEY);
};
