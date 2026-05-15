import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setListToken } from '../services/shoppingService';

const ShareListPage = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    if (token) {
      setListToken(token);
    }
    navigate('/', { replace: true });
  }, [navigate, token]);

  return null;
};

export default ShareListPage;
