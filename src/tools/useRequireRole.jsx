import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../elements/AuthProvider';

const useRequireRole = ({
    requireActor = false,
    requireDirector = false,
    requireActorProfile = false,
    requireDirectorProfile = false,
    requireActorOrDirector = false,
}) => {
    const { isActor, isDirector, actorProfileExists, directorProfileExists, ready } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!ready) return;

        // Must be actor OR director
        if (requireActorOrDirector && !isActor && !isDirector) {
            navigate('/unauthorized', { replace: true });
            return;
        }

        // Must be actor
        if (requireActor && !isActor) {
            navigate('/unauthorized', { replace: true });
            return;
        }

        // Must be director
        if (requireDirector && !isDirector) {
            navigate('/unauthorized', { replace: true });
            return;
        }

        // Must be actor with profile — if actor but no profile, send to create profile
        if (requireActorProfile) {
            if (!isActor) {
                navigate('/unauthorized', { replace: true });
                return;
            }
            if (!actorProfileExists) {
                navigate('/get-started/actor', { replace: true }); // redirect to create profile
                return;
            }
        }

        // Must be director with profile — if director but no profile, send to create profile
        if (requireDirectorProfile) {
            if (!isDirector) {
                navigate('/unauthorized', { replace: true });
                return;
            }
            if (!directorProfileExists) {
                navigate('/get-started/director', { replace: true }); // redirect to create profile
                return;
            }
        }

    }, [ready, isActor, isDirector, actorProfileExists, directorProfileExists]);
};

export default useRequireRole;