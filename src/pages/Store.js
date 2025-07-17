import React, { useState, useEffect } from 'react';
import '../styles/Store.css';
import { getStore, getBalance, redeemReward } from '../serivces/api'
import { getNavElements } from '../utils/getNavElements';
import { useNavigate } from 'react-router';
import Navbar from '../components/Navbar';
import getErrorMessage from '../utils/errors';
import { isConnected } from '../utils/isConnected';

const getIconUrl = (publicId) => {
  return `https://res.cloudinary.com/dezp7if8c/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1750900554/${publicId}.png`;
};

function ItemStore() {
  const [items, setItems] = useState([]);
  const [userCoins, setUserCoins] = useState(0); // Saldo inicial de moedas do usuário (MOCADO!)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseMessage, setPurchaseMessage] = useState({ show: false, type: '', message: '' });
  const [navElements, setNavElements] = useState([])
  const [ user, setUser ] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const connectedUser = isConnected()

    if (!connectedUser) {
      navigate('/login')
    }

    setUser(connectedUser.user)

    const navElements = getNavElements(connectedUser.user)

    setNavElements(navElements)

    const fetchBalance = async () => {
      const response = await getBalance(connectedUser.user.user_id, connectedUser.token)

      if (response.success) {
        setUserCoins(response.data.balance)
      } else {
        setError("Não foi possível carregar o seu saldo.");
        setLoading(false)
      }
    }
    const fetchStoreItems = async () => {
      setLoading(true);
      const response = await getStore(connectedUser.token)

      if (response.success) {
        setItems(response.data)
        await fetchBalance()
        setLoading(false)
      } else {
        setError("Não foi possível carregar os itens da loja.");
        setLoading(false)
      }
    };



    fetchStoreItems();
  }, [navigate]);

  const handleRedeemItem = async (item) => {
    if (!item.active) {
      displayMessage('error', `"${item.name}" não está ativo para resgate.`);
      return;
    }

    const response = await redeemReward(user, item._id, localStorage.getItem('token'))

    if (response.success) {
      setUserCoins(prevCoins => prevCoins - item.price);
      displayMessage('success', `Você resgatou "${item.name}" por ${item.price} moedas!`)
    } else {
      displayMessage('error', getErrorMessage(response.data))
    }
  };

  const displayMessage = (type, message) => {
    setPurchaseMessage({ show: true, type, message });
    setTimeout(() => {
      setPurchaseMessage({ show: false, type: '', message: '' });
    }, 3000); // Mensagem some após 3 segundos
  };

  if (loading) {
    return (
      <div className="store-container loading-state">
      <p>Carregando Loja...</p>
      <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="store-container error-state">
      <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <>
    <Navbar items={navElements} />
    <div className="store-container">
    <h2 className="store-title">Loja de Recompensas</h2>

    {purchaseMessage.show && (
      <div className={`purchase-message ${purchaseMessage.type}`}>
      {purchaseMessage.message}
      </div>
    )}

    <div className="user-balance">
    <span className="balance-icon">💰</span>
    Seus pontos: <span className="balance-amount">{userCoins}</span>
    </div>

    <div className="store-grid">
    {items.map((item) => {
      const canRedeem = item.active && userCoins >= item.price;
      const buttonText = !item.active ? 'Indisponível' : (userCoins < item.price ? 'Moedas Insuficientes' : 'Resgatar');

      return (
        <div key={item._id} className={`store-item ${!item.active ? 'inactive' : ''}`}>
        <div className="item-icon-wrapper">
        <img
        src={getIconUrl(item.icon)}
        alt={item.name}
        className="item-icon"
        />
        {!item.active && <div className="item-inactive-overlay">Indisponível</div>}
        </div>
        <h3 className="item-name">{item.name}</h3>
        <p className="item-price">
        <span className="price-icon">💎</span> {item.price}
        </p>
        <button
        className="item-redeem-button"
        onClick={() => handleRedeemItem(item)}
        disabled={!canRedeem}
        >
        {buttonText}
        </button>
        </div>
      );
    })}
    </div>
    </div>
    </>
  );
}

export default ItemStore;
