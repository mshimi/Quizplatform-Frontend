// src/hooks/useAutoLeaveLobby.ts
import { useEffect, useRef } from 'react';
import type { QuizLobby, User } from '../types';

function getToken(): string | null {
    return localStorage.getItem('accessToken'); // align with how you store the JWT
}

export function useAutoLeaveLobby(lobby?: QuizLobby, user?: User | null) {
    const alreadyLeftRef = useRef(false);

    const shouldSkip = () => sessionStorage.getItem('skipAutoLeave') === '1';

    const leaveLobbySync = async (id: string) => {
        if (alreadyLeftRef.current) return;
        alreadyLeftRef.current = true;

        const token = getToken();
        // If we have no token, don’t spam the endpoint; it would 401/403 anyway.
        if (!token) return;

        try {
            await fetch(`/api/v1/lobbies/${id}/participants/me`, {
                method: 'DELETE',
                keepalive: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // content-type isn’t required, but harmless:
                    'Content-Type': 'application/json',
                },
            });
        } catch {
            // ignore network errors during unload
        }
    };

    // Hard navigations / tab close – use pagehide (does not fire on SPA route change)
    useEffect(() => {
        if (!lobby || !user) return;

        const isHost = lobby.host.email === user.email;
        const isParticipant = lobby.participants.some(p => p.email === user.email);

        // Only auto-leave for participants (not host) while lobby is WAITING
        const ok = !isHost && isParticipant && lobby.status === 'WAITING';
        if (!ok) return;

        const onHide = () => {
            if (shouldSkip()) { sessionStorage.removeItem('skipAutoLeave'); return; }
            void leaveLobbySync(lobby.id);
        };

        window.addEventListener('pagehide', onHide);
        return () => window.removeEventListener('pagehide', onHide);
    }, [lobby, user]);

    // SPA unmount (route change within app)
    useEffect(() => {
        return () => {
            if (!lobby || !user) return;

            if (shouldSkip()) { sessionStorage.removeItem('skipAutoLeave'); return; }

            const isHost = lobby.host.email === user.email;
            const isParticipant = lobby.participants.some(p => p.email === user.email);
            const ok = !isHost && isParticipant && lobby.status === 'WAITING';
            if (ok) void leaveLobbySync(lobby.id);
        };
    }, [lobby, user]);

    // allow page code to set "we already left"
    const markLeft = () => {
        alreadyLeftRef.current = true;
    };

    return { markLeft };
}
