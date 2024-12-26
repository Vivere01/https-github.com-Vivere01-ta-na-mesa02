import React, { useState, useEffect } from 'react';
    import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
    import { v4 as uuidv4 } from 'uuid';
    import { FaList, FaUtensils, FaCheck, FaMoneyBill, FaClock, FaUser, FaCheckCircle, FaTimesCircle, FaCircle, FaBars, FaHamburger, FaGlassCheers, FaChartBar, FaCalendar } from 'react-icons/fa';

    const App = () => {
      const [tables, setTables] = useState(() => {
        const savedTables = localStorage.getItem('tables');
        return savedTables ? JSON.parse(savedTables) : [];
      });
      const [menuItems, setMenuItems] = useState(() => {
        const savedMenuItems = localStorage.getItem('menuItems');
        return savedMenuItems ? JSON.parse(savedMenuItems) : [];
      });
      const [orders, setOrders] = useState(() => {
        const savedOrders = localStorage.getItem('orders');
        return savedOrders ? JSON.parse(savedOrders) : [];
      });
      const [isNavOpen, setIsNavOpen] = useState(false);

      useEffect(() => {
        localStorage.setItem('tables', JSON.stringify(tables));
      }, [tables]);

      useEffect(() => {
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
      }, [menuItems]);

      useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
      }, [orders]);

      const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
      };

      return (
        <div className="container">
          <nav className={isNavOpen ? 'open' : ''}>
            <div className="nav-toggle" onClick={toggleNav}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <ul>
              <li><Link to="/"><FaList />Mesas</Link></li>
              <li><Link to="/menu"><FaUtensils />Cardápio</Link></li>
              <li><Link to="/kitchen"><FaClock />Cozinha</Link></li>
              <li><Link to="/cashflow"><FaMoneyBill />Fluxo de Caixa</Link></li>
              <li><Link to="/dashboard"><FaChartBar />Dashboard</Link></li>
            </ul>
          </nav>
          <div style={{ paddingTop: '60px' }}>
            <Routes>
              <Route path="/" element={<TablePage tables={tables} setTables={setTables} orders={orders} setOrders={setOrders} />} />
              <Route path="/menu" element={<MenuPage menuItems={menuItems} setMenuItems={setMenuItems} />} />
              <Route path="/kitchen" element={<KitchenPage orders={orders} setOrders={setOrders} menuItems={menuItems} tables={tables} />} />
              <Route path="/cashflow" element={<CashFlowPage tables={tables} orders={orders} setOrders={setOrders} />} />
              <Route path="/table/:tableId" element={<OrderPage tables={tables} menuItems={menuItems} orders={orders} setOrders={setOrders} />} />
              <Route path="/dashboard" element={<DashboardPage orders={orders} menuItems={menuItems} tables={tables} />} />
            </Routes>
          </div>
        </div>
      );
    };

    const TablePage = ({ tables, setTables, orders, setOrders }) => {
      const [newTableCount, setNewTableCount] = useState(1);

      const handleAddTables = () => {
        const newTables = [];
        for (let i = 0; i < newTableCount; i++) {
          const nextTableNumber = tables.length + i + 1;
          newTables.push({ id: uuidv4(), name: `Mesa ${nextTableNumber}`, status: 'Disponível' });
        }
        setTables([...tables, ...newTables]);
        setNewTableCount(1);
      };

      const handleTableStatusChange = (tableId, newStatus) => {
        const updatedTables = tables.map(table =>
          table.id === tableId ? { ...table, status: newStatus } : table
        );
        setTables(updatedTables);
      };

      const handleDeleteTable = (tableId) => {
        setTables(prevTables => prevTables.filter(table => table.id !== tableId));
        setOrders(prevOrders => prevOrders.filter(order => order.tableId !== tableId));
      };

      return (
        <div>
          <h2>Mesas</h2>
          <div>
            <input
              type="number"
              value={newTableCount}
              onChange={(e) => setNewTableCount(parseInt(e.target.value, 10))}
              min="1"
            />
            <button onClick={handleAddTables}>Adicionar Mesas</button>
          </div>
          <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
            {tables.map(table => (
              <li key={table.id} className="table-item">
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '5px' }}>
                  {table.name} - Status: {table.status === 'Disponível' ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />}
                </span>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button onClick={() => handleTableStatusChange(table.id, table.status === 'Disponível' ? 'Ocupada' : 'Disponível')}>
                    {table.status === 'Disponível' ? '🍽️ Ocupar' : '📥 Liberar'}
                  </button>
                  <Link to={`/table/${table.id}`}>
                    <button>🍽️ Tirar Pedido</button>
                  </Link>
                  <button className="negative" onClick={() => handleDeleteTable(table.id)}>🗑️ Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    };

    const MenuPage = ({ menuItems, setMenuItems }) => {
      const [newItemName, setNewItemName] = useState('');
      const [newItemPrice, setNewItemPrice] = useState('');
      const [newItemDetails, setNewItemDetails] = useState('');

      const handleAddItem = () => {
        if (newItemName && newItemPrice) {
          const newItem = {
            id: uuidv4(),
            name: newItemName,
            price: parseFloat(newItemPrice),
            details: newItemDetails,
          };
          setMenuItems([...menuItems, newItem]);
          setNewItemName('');
          setNewItemPrice('');
          setNewItemDetails('');
        }
      };

      return (
        <div>
          <h2>Cardápio</h2>
          <div>
            <input
              type="text"
              placeholder="Nome do Item"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Preço"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
            />
            <input
              type="text"
              placeholder="Detalhes"
              value={newItemDetails}
              onChange={(e) => setNewItemDetails(e.target.value)}
            />
            <button onClick={handleAddItem}>Adicionar Item</button>
          </div>
          <ul>
            {menuItems.map(item => (
              <li key={item.id} className="menu-item">
                <span>{item.name} - R$ {item.price.toFixed(2)}</span>
                <button>Detalhes</button>
              </li>
            ))}
          </ul>
        </div>
      );
    };

    const OrderPage = ({ tables, menuItems, orders, setOrders }) => {
      const { tableId } = useParams();
      const navigate = useNavigate();
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [selectedItems, setSelectedItems] = useState([]);
      const [selectedQuantity, setSelectedQuantity] = useState({});

      const table = tables.find(table => table.id === tableId);

      const handleOpenModal = () => {
        setIsModalOpen(true);
      };

      const handleCloseModal = () => {
        setIsModalOpen(false);
      };

      const handleAddItemToOrder = (itemId) => {
        setSelectedItems([...selectedItems, itemId]);
        setSelectedQuantity(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
      };

      const handleRemoveItemFromOrder = (itemId) => {
        const updatedItems = selectedItems.filter(id => id !== itemId);
        setSelectedItems(updatedItems);
        setSelectedQuantity(prev => {
          const { [itemId]: removed, ...rest } = prev;
          return rest;
        });
      };

      const handleQuantityChange = (itemId, quantity) => {
        setSelectedQuantity(prev => ({ ...prev, [itemId]: parseInt(quantity, 10) }));
      };

      const handlePlaceOrder = () => {
        if (selectedItems.length > 0) {
          const orderItems = selectedItems.map(itemId => ({
            itemId,
            quantity: selectedQuantity[itemId] || 1,
          }));
          const newOrder = {
            id: uuidv4(),
            tableId: tableId,
            items: orderItems,
            status: 'Novo Pedido',
          };
          setOrders(prevOrders => {
            const updatedOrders = [...prevOrders, newOrder];
            navigate('/kitchen');
            return updatedOrders;
          });
          setSelectedItems([]);
          setSelectedQuantity({});
          setIsModalOpen(false);
        }
      };

      if (!table) {
        return <div>Mesa não encontrada.</div>;
      }

      return (
        <div>
          <h2>Mesa: {table.name}</h2>
          <button onClick={handleOpenModal}>Tirar Pedido</button>

          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <button onClick={handleCloseModal} style={{ float: 'right' }}>Fechar</button>
                <h3>Itens do Cardápio</h3>
                <ul>
                  {menuItems.map(item => (
                    <li key={item.id} className="menu-item">
                      <span>{item.name} - R$ {item.price.toFixed(2)}</span>
                      <button onClick={() => handleAddItemToOrder(item.id)}>Adicionar</button>
                    </li>
                  ))}
                </ul>
                <h3>Pedido Atual</h3>
                {selectedItems.length > 0 ? (
                  <ul>
                    {selectedItems.map(itemId => {
                      const item = menuItems.find(menuItem => menuItem.id === itemId);
                      return (
                        <li key={itemId} className="order-item">
                          <span>{item.name}</span>
                          <div>
                            <input
                              type="number"
                              value={selectedQuantity[itemId] || 1}
                              onChange={(e) => handleQuantityChange(itemId, e.target.value)}
                              min="1"
                            />
                            <button onClick={() => handleRemoveItemFromOrder(itemId)}>Remover</button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>Nenhum item selecionado.</p>
                )}
                <button onClick={handlePlaceOrder} disabled={selectedItems.length === 0}>
                  Confirmar Pedido
                </button>
              </div>
            </div>
          )}
        </div>
      );
    };

    const KitchenPage = ({ orders, setOrders, menuItems, tables }) => {
      const navigate = useNavigate();
      const handleOrderStatusChange = (orderId, newStatus) => {
        setOrders(prevOrders => {
          const updatedOrders = prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          );
          if (newStatus === 'Pronto') {
            navigate('/cashflow');
          }
          return updatedOrders;
        });
      };

      const kitchenOrders = orders.filter(order => order.status === 'Novo Pedido' || order.status === 'Em andamento');

      return (
        <div>
          <h2>Cozinha</h2>
          <ul>
            {kitchenOrders.map(order => {
              const table = tables.find(table => table.id === order.tableId);
              return (
                <li key={order.id} className="kitchen-order" style={{ backgroundColor: table ? (table.id % 2 === 0 ? '#f0f0f0' : '#e0e0e0') : '#f0f0f0' }}>
                  <h3>Mesa: {table ? table.name : 'Mesa não encontrada'}</h3>
                  <p>Status: {order.status}</p>
                  <ul>
                    {order.items.map(orderItem => {
                      const menuItem = menuItems.find(item => item.id === orderItem.itemId);
                      return (
                        <li key={orderItem.itemId}>
                          <span>{menuItem ? menuItem.name : 'Item não encontrado'}</span>
                          <span>Quantidade: {orderItem.quantity}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <div>
                    <button onClick={() => handleOrderStatusChange(order.id, 'Em andamento')}>Em Andamento</button>
                    <button onClick={() => handleOrderStatusChange(order.id, 'Pronto')}>Pronto</button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      );
    };

    const CashFlowPage = ({ tables, orders, setOrders }) => {
      const calculateTotal = (order) => {
        let total = 0;
        order.items.forEach(orderItem => {
          const menuItem = menuItems.find(item => item.id === orderItem.itemId);
          if (menuItem) {
            total += menuItem.price * orderItem.quantity;
          }
        });
        return total;
      };

      const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');

      const activeTables = tables.filter(table =>
        orders.some(order => order.tableId === table.id && order.status === 'Pronto')
      );

      const handleOrderPaid = (tableId) => {
        setOrders(prevOrders => prevOrders.filter(order => order.tableId !== tableId || order.status !== 'Pronto'));
        setTables(prevTables => prevTables.map(table => table.id === tableId ? { ...table, status: 'Disponível' } : table));
      };

      return (
        <div>
          <h2>Fluxo de Caixa</h2>
          {activeTables.map(table => {
            const tableOrders = orders.filter(order => order.tableId === table.id && order.status === 'Pronto');
            if (tableOrders.length === 0) {
              return null;
            }
            return (
              <div key={table.id}>
                <h3>Mesa: {table.name}</h3>
                <table className="cashflow-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantidade</th>
                      <th>Preço Unitário</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableOrders.map(order =>
                      order.items.map(orderItem => {
                        const menuItem = menuItems.find(item => item.id === orderItem.itemId);
                        if (!menuItem) return null;
                        const itemTotal = menuItem.price * orderItem.quantity;
                        return (
                          <tr key={orderItem.itemId}>
                            <td>{menuItem.name}</td>
                            <td>{orderItem.quantity}</td>
                            <td>R$ {menuItem.price.toFixed(2)}</td>
                            <td>R$ {itemTotal.toFixed(2)}</td>
                          </tr>
                        );
                      })
                    )}
                    <tr>
                      <td colSpan="3"><strong>Total da Mesa:</strong></td>
                      <td><strong>R$ {tableOrders.reduce((acc, order) => acc + calculateTotal(order), 0).toFixed(2)}</strong></td>
                    </tr>
                  </tbody>
                </table>
                <button onClick={() => handleOrderPaid(table.id)}>Pago</button>
              </div>
            );
          })}
        </div>
      );
    };

    const DashboardPage = ({ orders, menuItems, tables }) => {
      const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

      const calculateDailySales = (date) => {
        const filteredOrders = orders.filter(order => {
          const orderDate = new Date(order.id.substring(0, 10)).toISOString().split('T')[0];
          return orderDate === date && order.status === 'Pronto';
        });

        let totalSales = 0;
        filteredOrders.forEach(order => {
          order.items.forEach(orderItem => {
            const menuItem = menuItems.find(item => item.id === orderItem.itemId);
            if (menuItem) {
              totalSales += menuItem.price * orderItem.quantity;
            }
          });
        });
        return totalSales;
      };

      const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
      };

      const sales = calculateDailySales(selectedDate);

      const generateChartData = () => {
        const days = [];
        const salesData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const formattedDate = date.toISOString().split('T')[0];
          days.push(formattedDate.split('-').slice(1).join('/'));
          salesData.push(calculateDailySales(formattedDate));
        }
        return { days, salesData };
      };

      const { days, salesData } = generateChartData();

      const chartHeight = 200;
      const chartWidth = 400;
      const maxSale = Math.max(...salesData);
      const barWidth = chartWidth / days.length;

      const generateChartBars = () => {
        return salesData.map((sale, index) => {
          const barHeight = (sale / maxSale) * chartHeight * 0.8;
          const x = index * barWidth;
          const y = chartHeight - barHeight;
          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={barWidth - 2}
              height={barHeight}
              fill="#03a9f4"
            />
          );
        });
      };

      const generateChartLabels = () => {
        return days.map((day, index) => {
          const x = index * barWidth + barWidth / 2;
          const y = chartHeight + 15;
          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="10"
              fill="#555"
            >
              {day}
            </text>
          );
        });
      };

      const totalFaturamento = tables.reduce((acc, table) => {
        const tableOrders = orders.filter(order => order.tableId === table.id && order.status === 'Pronto');
        return acc + tableOrders.reduce((orderAcc, order) => {
          let orderTotal = 0;
          order.items.forEach(orderItem => {
            const menuItem = menuItems.find(item => item.id === orderItem.itemId);
            if (menuItem) {
              orderTotal += menuItem.price * orderItem.quantity;
            }
          });
          return orderAcc + orderTotal;
        }, 0);
      }, 0);

      return (
        <div>
          <h2>Dashboard</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <label htmlFor="datePicker" style={{ marginRight: '10px' }}>Selecionar Data:</label>
            <input
              type="date"
              id="datePicker"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          <p>Total de Faturamento: R$ {totalFaturamento.toFixed(2)}</p>
          <p>Vendas do dia {selectedDate}: R$ {sales.toFixed(2)}</p>
          <div className="chart-container">
            <svg className="chart-svg" width={chartWidth} height={chartHeight + 30}>
              {generateChartBars()}
              {generateChartLabels()}
            </svg>
          </div>
        </div>
      );
    };

    export default App;
