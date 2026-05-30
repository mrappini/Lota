import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export function useGamification() {
  const [lotaPoints, setLotaPoints] = useState(() => {
    return parseInt(localStorage.getItem('lota-points') || '0', 10);
  });

  const [inventory, setInventory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('lota-inventory') || '["default"]');
    } catch {
      return ["default"];
    }
  });

  const [equippedTheme, setEquippedTheme] = useState<string>(() => {
    return localStorage.getItem('lota-equipped-theme') || 'default';
  });

  const [equippedLogo, setEquippedLogo] = useState<string>(() => {
    return localStorage.getItem('lota-equipped-logo') || 'default';
  });

  const addPoints = (amount: number) => {
    const newPoints = lotaPoints + amount;
    setLotaPoints(newPoints);
    localStorage.setItem('lota-points', newPoints.toString());
    return newPoints;
  };

  const spendPoints = (amount: number): boolean => {
    if (lotaPoints >= amount) {
      const newPoints = lotaPoints - amount;
      setLotaPoints(newPoints);
      localStorage.setItem('lota-points', newPoints.toString());
      return true;
    }
    return false;
  };

  const buyItem = (id: string, price: number, type: 'theme' | 'logo') => {
    if (inventory.includes(id)) {
      toast.error('Você já possui este item!');
      return false;
    }
    
    if (spendPoints(price)) {
      const newInv = [...inventory, id];
      setInventory(newInv);
      localStorage.setItem('lota-inventory', JSON.stringify(newInv));
      toast.success('Compra realizada com sucesso! 🎉');
      equipItem(id, type);
      return true;
    } else {
      toast.error('LotaPoints insuficientes.');
      return false;
    }
  };

  const equipItem = (id: string, type: 'theme' | 'logo', force: boolean = false) => {
    if (!inventory.includes(id) && id !== 'default' && !force) return;
    
    if (type === 'theme') {
      setEquippedTheme(id);
      localStorage.setItem('lota-equipped-theme', id);
      if (id !== 'default') {
        setEquippedLogo('default');
        localStorage.setItem('lota-equipped-logo', 'default');
      }
    } else if (type === 'logo') {
      setEquippedLogo(id);
      localStorage.setItem('lota-equipped-logo', id);
      if (id !== 'default') {
        setEquippedTheme('default');
        localStorage.setItem('lota-equipped-theme', 'default');
      }
    }
    toast.success('Item equipado!');
  };

  // Nível simples baseado nos pontos (historicamente ganhos, mas pra simplificar vamos usar saldo atual + gastos? Não, melhor usar o total ganho)
  // Como não salvamos o total ganho separado, vamos calcular o nível pelo saldo atual + valor do inventário.
  const calculateTotalEarned = () => {
    let spent = 0;
    if (inventory.includes('gold_logo')) spent += 50;
    if (inventory.includes('hacker_theme')) spent += 150;
    if (inventory.includes('amethyst_theme')) spent += 150;
    return lotaPoints + spent;
  };

  const totalEarned = calculateTotalEarned();
  const level = Math.floor(totalEarned / 50) + 1;
  const nextLevelPoints = level * 50;
  const progress = (totalEarned % 50) / 50;

  return { 
    lotaPoints, 
    addPoints,
    spendPoints,
    level,
    nextLevelPoints,
    progress,
    inventory,
    buyItem,
    equipItem,
    equippedTheme,
    equippedLogo
  };
}
