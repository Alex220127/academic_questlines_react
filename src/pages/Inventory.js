// UserInventory.js
import React, { useState, useEffect } from 'react';
import '../styles/Inventory.css'; // Importa o arquivo CSS
import { useNavigate } from 'react-router';
import { getNavElements } from '../utils/getNavElements';
import { getInventory } from '../serivces/api';
import Navbar from '../components/Navbar';
import { isConnected } from '../utils/isConnected';

// Função auxiliar para formatar as datas (reutilizada do modal de conclusão)
const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const getIconUrl = (publicId) => {
  return `https://res.cloudinary.com/dezp7if8c/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1750900554/${publicId}.png`;
};

function UserInventory() {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navElements, setNavElements] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const connectedUser = isConnected()

    if (!connectedUser) {
      navigate('/login')
    }

    const { user, token } = connectedUser

    const navElements = getNavElements(user)

    setNavElements(navElements)

    const fetchInventory = async () => {
      setLoading(true);
      const response = await getInventory(user, token)

      if (response.success) {
        setInventory(response.data)
        setLoading(false)
      } else {
        setError("Não foi possível carregar os itens da loja.");
        setLoading(false)
      }
    }

    fetchInventory();
  }, [navigate]);

  const handleUseItem = (itemId) => {
    console.log(`Tentando usar o item com ID: ${itemId}`);

    setInventory(prevInventory => ({
      ...prevInventory,
      items: prevInventory.items.map(item =>
        item._id === itemId ? { ...item, used: true } : item
      )
    }));
    alert(`"${inventory.items.find(i => i._id === itemId).name}" usado com sucesso!`);
  };

  if (loading) {
    return (
      <div className="inventory-container loading-state">
        <p>Carregando Inventário...</p>
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inventory-container error-state">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!inventory || inventory.items.length === 0) {
    return (
      <>
        <Navbar items={navElements} />
        <div className="inventory-container empty-state">
          <h2 className="inventory-title">Meu Inventário</h2>
          <p>Seu inventário está vazio. Resgate itens na loja para começar!</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar items={navElements} />
      <div className="inventory-container">
        <h2 className="inventory-title">Meu Inventário</h2>

        <div className="inventory-grid">
          {inventory.items.map((item) => (
            <div key={item._id} className={`inventory-item ${item.used ? 'used' : ''}`}>
              <div className="item-icon-wrapper">
                <img
                  src={getIconUrl(item.icon)}
                  alt={item.name}
                  className="item-icon"
                />
                {item.used && <div className="item-used-overlay">Usado</div>}
              </div>
              <h3 className="item-name">{item.name}</h3>
              {item.price !== undefined && ( // Exibe o preço se ele existir no item do inventário
                <p className="item-price">Preço de Resgate: {item.price} Moedas</p>
              )}
              {item.redeemed_at && (
                <p className="item-redeemed-date">Resgatado em: {formatDateTime(item.redeemed_at)}</p>
              )}

              {!item.used ? (
                <button className="item-use-button" onClick={() => handleUseItem(item._id)}>
                  Usar Item
                </button>
              ) : (
                <button className="item-use-button used-button" disabled>Item Usado</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default UserInventory;
