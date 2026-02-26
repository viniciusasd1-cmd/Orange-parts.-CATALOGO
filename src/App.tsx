/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  Bell, 
  Grid, 
  LogOut, 
  Sun, 
  Moon, 
  Globe, 
  FileText, 
  Bookmark, 
  Copy, 
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Smartphone,
  Apple,
  MessageCircle,
  ArrowUp,
  Filter,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './supabase';

// --- Types ---

interface Product {
  id: number;
  name: string;
  code: string;
  category: string;
  description: string;
  originalCode: string;
  brand: string;
  competitorCode: string;
  competitorBrand: string;
  application: string;
  position: string;
  price: number;
  stock: number;
  location: string;
  image: string;
}

interface User {
  id: number;
  name: string;
  role: 'admin' | 'product_manager' | 'seller';
}

// --- Mock Data ---

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Kit Bolsa Volvo NH traseiro",
    code: "BT 5216",
    category: "Cabine",
    description: "Kit Bolsa Cabine Volvo FH DIANTEIRO",
    originalCode: "31729841",
    brand: "Volvo",
    competitorCode: "AC1312 / 311442 / CB0123 / BTC04112 / HG3312",
    competitorBrand: "Fort Peças / Sachs / Monroe / Cofap / Nakata",
    application: "NH12/NL10/NL12/NL12 EDC////",
    position: "Traseiro",
    price: 105.00,
    stock: 1,
    location: "A-06",
    image: "https://picsum.photos/seed/bt5216/600/400"
  },
  {
    id: 2,
    name: "Kit Bolsa Volvo NH traseiro",
    code: "BT 5217",
    category: "Cabine",
    description: "Kit Bolsa Cabine Volvo FH TODOS TRASEIRO",
    originalCode: "20427897 / 1075076 / 1075077 / 3172985",
    brand: "Volvo",
    competitorCode: "AC1312 / 311442 / CB0123 / BTC04112 / HG3313",
    competitorBrand: "Fort Peças / Sachs / Monroe / Cofap / Nakata",
    application: "NH12/NL10/NL12/NL12 EDC////",
    position: "Traseiro",
    price: 105.00,
    stock: 1,
    location: "A-07",
    image: "https://picsum.photos/seed/bt5217/600/400"
  },
  {
    id: 3,
    name: "Bolsa Volvo FH traseiro",
    code: "BT 5227",
    category: "Cabine",
    description: "Bolsa Cabine Volvo NH",
    originalCode: "20462622",
    brand: "Volvo",
    competitorCode: "AC1305 / 311436 / CB0116 / BTC04105 / HG3310",
    competitorBrand: "Fort Peças / Sachs / Monroe / Cofap / Nakata",
    application: "FH12/FH13/FH16/FM7/FM9/FM10/FM12/FM17",
    position: "Traseiro",
    price: 205.00,
    stock: 1,
    location: "A-05",
    image: "https://picsum.photos/seed/bt5227/600/400"
  },
  {
    id: 4,
    name: "Cabine Mola MB Accelo traseiro",
    code: "CT 5100",
    category: "Cabine",
    description: "Amortecedor cabine MB Accelo traseiro",
    originalCode: "9793100055",
    brand: "Mercedes",
    competitorCode: "AC1200 / 311420 / 65484 / B4735",
    competitorBrand: "Fort Peças / Sachs / Monroe / Cofap / Nakata",
    application: "Accelo 715C/Accelo 815C/Accelo 915C/Accelo 1016/Accelo 1316",
    position: "Traseiro",
    price: 295.00,
    stock: 1,
    location: "A-01",
    image: "https://picsum.photos/seed/ct5100/600/400"
  }
];

// --- Components ---

const ImageModal = ({ src, isOpen, onClose }: { src: string, isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md cursor-zoom-out"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative max-w-5xl w-full aspect-video rounded-2xl overflow-hidden shadow-2xl"
      >
        <img src={src} alt="Zoom" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <Trash2 className="w-6 h-6 rotate-45" />
        </button>
      </motion.div>
    </div>
  );
};

const ProductDetailModal = ({ product, isOpen, onClose, showPrice, onAddToCart }: { product: Product, isOpen: boolean, onClose: () => void, showPrice: boolean, onAddToCart: (p: Product) => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row"
      >
        <div className="w-full md:w-1/2 aspect-square bg-zinc-100 dark:bg-zinc-950">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="flex-1 p-8 overflow-y-auto max-h-[80vh] md:max-h-none space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">{product.category}</span>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">{product.name}</h2>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
              <Trash2 className="w-6 h-6 rotate-45" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Código Interno</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{product.code}</span>
            </div>
            {showPrice && (
              <div className="space-y-1">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Preço de Venda</span>
                <span className="text-xl font-black text-orange-500">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>

          <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Descrição</span>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Marca / Cód. Original</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{product.brand} - {product.originalCode}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Posição</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{product.position}</p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Aplicação</span>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{product.application}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Cód. Concorrentes</span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-500 font-mono">{product.competitorCode}</p>
            </div>

            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Estoque</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{product.stock} unidades</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Localização</span>
                <span className="text-sm font-bold text-orange-500">{product.location}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3"
            >
              <Bookmark className="w-5 h-5" />
              Adicionar à Cotação
            </button>
            <button 
              onClick={() => {
                const text = `Olá! Gostaria de um orçamento para o produto: ${product.name} (Código: ${product.code})`;
                window.open(`https://wa.me/5511992195913?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Direto
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const LoginForm = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch profile for role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        onLogin({
          id: data.user.id as any,
          name: data.user.user_metadata.name || data.user.email?.split('@')[0] || 'Usuário',
          role: (profile?.role as any) || 'seller'
        });
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 border border-zinc-200 dark:border-zinc-800"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-xl shadow-orange-500/20">
            O
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Orange Part's</h1>
          <p className="text-sm text-zinc-500 font-medium mt-1">Acesse o catálogo restrito</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">E-mail</label>
            <input 
              required 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all dark:text-white" 
              placeholder="admin@orangeparts.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Senha</label>
            <input 
              required 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all dark:text-white" 
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98]"
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>
        
        <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            Contas de Teste:
          </p>
          <div className="mt-2 text-[10px] text-zinc-500 space-y-1">
            <p>Admin: admin@orangeparts.com / admin123</p>
            <p>Manager: manager@orangeparts.com / manager123</p>
            <p>Seller: seller@orangeparts.com / seller123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Header = ({ darkMode, setDarkMode, onAddProduct, user, onLogout, cartCount, onOpenCart }: { darkMode: boolean, setDarkMode: (v: boolean) => void, onAddProduct: () => void, user: User | null, onLogout: () => void, cartCount: number, onOpenCart: () => void }) => {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
            <Menu className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                O
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-zinc-900 dark:bg-white rounded-full border-2 border-white dark:border-zinc-900" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black leading-none text-zinc-900 dark:text-white tracking-tighter">ORANGE PART'S</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-black">Amortecedores</p>
            </div>
          </a>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative group hidden sm:block">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Pesquisar produtos..." 
            className="w-full bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-orange-500/30 rounded-full py-2.5 pl-12 pr-4 focus:ring-4 focus:ring-orange-500/5 text-sm transition-all outline-none dark:text-white"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-3">
          <button 
            onClick={onOpenCart}
            className="p-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full relative transition-colors"
            title="Carrinho de Cotação"
          >
            <Bookmark className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900">
                {cartCount}
              </span>
            )}
          </button>

          {user && (user.role === 'admin' || user.role === 'product_manager') && (
            <button 
              onClick={onAddProduct}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
            >
              <Grid className="w-4 h-4" />
              <span>Cadastrar</span>
            </button>
          )}
          
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            title={darkMode ? "Modo Claro" : "Modo Escuro"}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3 ml-2">
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-zinc-900 dark:text-white leading-none">{user.name}</p>
                <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest mt-0.5">{user.role}</p>
              </div>
              <button 
                onClick={onLogout}
                className="p-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => window.location.hash = '#login'}
              className="p-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              title="Login Administrativo"
            >
              <Globe className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* SubHeader Nav */}
      <nav className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center h-12 gap-8 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
            {['Home', 'Lançamentos'].map((item, idx) => (
              <a 
                key={item} 
                href="#" 
                className={`transition-all relative py-4 ${idx === 0 ? 'text-orange-500' : 'text-zinc-500 dark:text-zinc-500 hover:text-orange-500'}`}
              >
                {item}
                {idx === 0 && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                  />
                )}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

const Sidebar = () => {
  const filterGroups = [
    { title: 'Montadora', type: 'select' },
    { title: 'Modelo', type: 'select' },
    { title: 'Ano', type: 'select' },
    { title: 'Categorias', type: 'list', items: ['Amortecedores', 'Buchas', 'Tensores', 'Barras', 'Suportes'] }
  ];

  return (
    <aside className="w-72 hidden lg:block border-r border-zinc-200 dark:border-zinc-800 p-8 space-y-10">
      {filterGroups.map((group) => (
        <div key={group.title} className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">
            {group.title}
          </h3>
          {group.type === 'select' ? (
            <div className="relative group">
              <select className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 px-4 text-sm appearance-none outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all dark:text-white">
                <option>Selecione...</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none group-focus-within:text-orange-500 transition-colors" />
            </div>
          ) : (
            <div className="space-y-3">
              {group.items?.map(item => (
                <label key={item} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer w-5 h-5 rounded-lg border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-orange-500 focus:ring-orange-500/20 transition-all" />
                  </div>
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-orange-500 transition-colors">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      
      <button className="w-full py-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700">
        <Trash2 className="w-4 h-4" />
        Limpar Filtros
      </button>
    </aside>
  );
};

const ProductCard: React.FC<{ 
  product: Product, 
  onCompare: (p: Product) => void, 
  isCompared: boolean,
  onZoom: (src: string) => void,
  onDetail: (p: Product) => void,
  onDelete?: (id: number) => void,
  userRole?: string,
  showPrice: boolean,
  onAddToCart: (p: Product) => void
}> = ({ product, onCompare, isCompared, onZoom, onDetail, onDelete, userRole, showPrice, onAddToCart }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50 dark:bg-zinc-950 cursor-zoom-in">
        <img 
          src={product.image} 
          alt={product.name}
          onClick={() => onZoom(product.image)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center gap-2 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            {product.code}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-orange-500 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-5">
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2 min-h-[2.5rem] group-hover:text-orange-500 transition-colors leading-relaxed">
            {product.name}
          </h2>
          {showPrice && (
            <div className="text-right">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Preço</span>
              <span className="text-lg font-black text-zinc-900 dark:text-white">
                <span className="text-xs font-bold text-orange-500 mr-1">R$</span>
                {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-zinc-400 font-bold uppercase tracking-widest">Marca</span>
            <span className="text-zinc-900 dark:text-zinc-200 font-bold">{product.brand}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-zinc-400 font-bold uppercase tracking-widest">Posição</span>
            <span className="text-zinc-900 dark:text-zinc-200 font-bold">{product.position}</span>
          </div>
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Aplicação</span>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {product.application}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onCompare(product)}
            className={`transition-all p-1.5 rounded-lg ${isCompared ? 'text-orange-500 bg-orange-500/10' : 'text-zinc-400 hover:text-orange-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`} 
            title="Comparar"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onAddToCart(product)}
            className="text-zinc-400 hover:text-orange-500 transition-all p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" 
            title="Adicionar à Cotação"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          {userRole === 'admin' && onDelete && (
            <button 
              onClick={() => onDelete(product.id)}
              className="text-zinc-400 hover:text-red-500 transition-all p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10" 
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <button 
          onClick={() => onDetail(product)}
          className="text-[10px] font-black text-orange-500 hover:text-orange-600 transition-all uppercase tracking-[0.15em] flex items-center gap-1 group/btn"
        >
          Ver Mais
          <motion.span 
            animate={{ x: [0, 3, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-lg leading-none"
          >
            ›
          </motion.span>
        </button>
      </div>
    </motion.div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-12 transition-colors">
      <div className="container mx-auto px-4 text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/20">
              O
            </div>
            <h2 className="text-lg font-black text-zinc-900 dark:text-white tracking-tighter">ORANGE PART'S</h2>
          </div>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto font-medium">
            Especialistas em amortecedores e suspensões de alta performance para veículos pesados.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            Siga-nos nas Redes Sociais
          </h3>
          <div className="flex gap-4">
            {[Facebook, Instagram, Linkedin, Smartphone, Apple].map((Icon, i) => (
              <a 
                key={i} 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-[10px] text-zinc-400 font-black uppercase tracking-widest">
          <div className="flex gap-4">
            <a href="#" className="hover:text-orange-500 transition-colors">© 2017 - 2026 Orange Part's</a>
            <span className="text-zinc-200 dark:text-zinc-800">|</span>
            <a href="#" className="hover:text-orange-500 transition-colors">Termos de Utilização</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ProductForm = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (p: Product) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Cabine',
    description: '',
    originalCode: '',
    brand: '',
    competitorCode: '',
    competitorBrand: '',
    application: '',
    position: 'Traseiro',
    price: '',
    stock: '1',
    location: '',
    image: ''
  });

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Date.now(),
      name: formData.name,
      code: formData.code,
      category: formData.category,
      description: formData.description,
      originalCode: formData.originalCode,
      brand: formData.brand,
      competitorCode: formData.competitorCode,
      competitorBrand: formData.competitorBrand,
      application: formData.application,
      position: formData.position,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      location: formData.location,
      image: formData.image || `https://picsum.photos/seed/${Date.now()}/600/400`
    };
    onAdd(newProduct);
    onClose();
    setFormData({ 
      name: '', code: '', category: 'Cabine', description: '', originalCode: '', 
      brand: '', competitorCode: '', competitorBrand: '', application: '', 
      position: 'Traseiro', price: '', stock: '1', location: '', image: '' 
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
      >
        <div className="p-8 space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Cadastrar Produto</h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
              <Trash2 className="w-6 h-6 rotate-45" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Imagem do Produto</label>
              <div className="relative group aspect-video rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 hover:border-orange-500/50 transition-all">
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, image: ''})}
                        className="bg-red-500 text-white p-2 rounded-full shadow-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-2">
                    <Grid className="w-8 h-8 text-zinc-300 mx-auto" />
                    <p className="text-xs font-bold text-zinc-400">Clique para fazer upload</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nome do Produto</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Código</label>
                <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Categoria</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all dark:text-white">
                  <option>Cabine</option>
                  <option>Bolsa</option>
                  <option>Kit Mola</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Preço (R$)</label>
                <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Estoque</label>
                <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all dark:text-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Descrição</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all dark:text-white h-24 resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Marca Original</label>
                <input value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Cód. Original</label>
                <input value={formData.originalCode} onChange={e => setFormData({...formData, originalCode: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all dark:text-white" />
              </div>
            </div>

            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98]">
              Salvar Produto
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const CompareBar = ({ items, onRemove, onClear }: { items: Product[], onRemove: (id: number) => void, onClear: () => void }) => {
  if (items.length === 0) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 py-4"
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar flex-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Comparar</span>
            <span className="text-sm font-bold text-zinc-900 dark:text-white whitespace-nowrap">
              <span className="text-orange-500">{items.length}</span> / 4 itens
            </span>
          </div>
          <div className="flex gap-3">
            {items.map(item => (
              <div key={item.id} className="relative group">
                <div className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {[...Array(4 - items.length)].map((_, i) => (
              <div key={i} className="w-12 h-12 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                <Grid className="w-4 h-4" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onClear}
            className="text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            Limpar
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Comparar Agora
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CartModal = ({ items, isOpen, onClose, onRemove, onClear }: { items: Product[], isOpen: boolean, onClose: () => void, onRemove: (id: number) => void, onClear: () => void }) => {
  if (!isOpen) return null;

  const sendWhatsApp = () => {
    const productList = items.map(item => `- ${item.name} (${item.code})`).join('\n');
    const text = `Olá! Gostaria de um orçamento para os seguintes produtos:\n\n${productList}`;
    window.open(`https://wa.me/5511992195913?text=${encodeURIComponent(text)}`, '_blank');
  };

  const sendEmail = () => {
    const productList = items.map(item => `- ${item.name} (${item.code})`).join('\n');
    const subject = 'Solicitação de Orçamento - Orange Part\'s';
    const body = `Olá!\n\nGostaria de um orçamento para os seguintes produtos:\n\n${productList}`;
    window.location.href = `mailto:vendas@orangeparts.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
      >
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Carrinho de Cotação</h2>
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{items.length} itens selecionados</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
            <Trash2 className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto no-scrollbar space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <Bookmark className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto" />
              <p className="text-sm font-bold text-zinc-400">Seu carrinho está vazio</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl group">
                <img src={item.image} alt="" className="w-16 h-16 object-cover rounded-xl" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white truncate">{item.name}</h3>
                  <p className="text-[10px] font-black text-orange-500 uppercase">{item.code}</p>
                </div>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={sendWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
              <button 
                onClick={sendEmail}
                className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-zinc-900/10 flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4" />
                E-mail
              </button>
            </div>
            <button 
              onClick={onClear}
              className="w-full text-[10px] font-black text-zinc-400 hover:text-red-500 uppercase tracking-widest transition-colors"
            >
              Limpar Tudo
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [comparedItems, setComparedItems] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          setUser({
            id: session.user.id as any,
            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'Usuário',
            role: (profile?.role as any) || 'seller'
          });
        }
      } catch (e) {
        console.error('Auth error:', e);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchProducts(); // Fetch products for everyone

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          setUser({
            id: session.user.id as any,
            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'Usuário',
            role: (profile?.role as any) || 'seller'
          });
        } catch (e) {
          setUser({
            id: session.user.id as any,
            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'Usuário',
            role: 'seller'
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false })
        .limit(100); // Show more products
      
      if (error) throw error;
      if (data) setProducts(data);
    } catch (e) {
      console.error('Error fetching products:', e);
      // Fallback to mock data if supabase fails or is not configured
      setProducts(MOCK_PRODUCTS);
    }
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleCompare = (product: Product) => {
    setComparedItems(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 4) return prev;
      return [...prev, product];
    });
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
    setIsCartOpen(true);
  };

  const addProduct = async (newProduct: Product) => {
    try {
      // Remove temporary ID for Supabase to generate one
      const { id, ...productData } = newProduct;
      const { error } = await supabase
        .from('products')
        .insert([{ ...productData, created_by: user?.id }]);
      
      if (error) throw error;
      fetchProducts();
    } catch (e) {
      console.error('Error adding product:', e);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchProducts();
    } catch (e) {
      console.error('Error deleting product:', e);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return null;

  // Check if we are on login page (via hash)
  const isLoginPage = window.location.hash === '#login';
  if (isLoginPage && !user) {
    return <div className={darkMode ? 'dark' : ''}><LoginForm onLogin={(u) => { setUser(u); window.location.hash = ''; }} /></div>;
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-200 selection:bg-orange-500/30 pb-24">
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          onAddProduct={() => setIsFormOpen(true)}
          user={user}
          onLogout={handleLogout}
          cartCount={cartItems.length}
          onOpenCart={() => setIsCartOpen(true)}
        />

        <div className="container mx-auto flex">
          <Sidebar />

          <main className="flex-1 p-6 sm:p-10 lg:p-12">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                  Catálogo Online
                </h2>
                <p className="text-sm text-zinc-500 font-medium">
                  Encontramos <span className="text-orange-500 font-bold">{products.length}</span> produtos para sua busca
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
                >
                  <FileText className="w-4 h-4 text-red-500" />
                  Salvar em PDF
                </button>
                <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800" />
                <div className="relative group">
                  <span className="absolute -top-4 left-0 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Ordenar por</span>
                  <select className="bg-transparent border-none text-sm font-bold text-zinc-900 dark:text-white outline-none cursor-pointer hover:text-orange-500 transition-colors appearance-none pr-8 py-1">
                    <option>Mais Acessos</option>
                    <option>Recentes</option>
                    <option>Código (A-Z)</option>
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-zinc-400" />
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onCompare={toggleCompare}
                  isCompared={!!comparedItems.find(p => p.id === product.id)}
                  onZoom={setZoomedImage}
                  onDetail={setSelectedProduct}
                  onDelete={deleteProduct}
                  userRole={user?.role}
                  showPrice={!!user}
                  onAddToCart={addToCart}
                />
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-20 flex flex-col items-center gap-6">
              <div className="w-full max-w-xs h-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((products.length / 249) * 100, 100)}%` }}
                  className="h-full bg-orange-500"
                />
              </div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Você viu {products.length} de 249 produtos</p>
              <button className="px-12 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-zinc-900/10 dark:shadow-none active:scale-95">
                Carregar Mais
              </button>
            </div>
          </main>
        </div>

        <Footer />

        <AnimatePresence>
          <CompareBar 
            items={comparedItems} 
            onRemove={(id) => setComparedItems(prev => prev.filter(p => p.id !== id))}
            onClear={() => setComparedItems([])}
          />
        </AnimatePresence>

        <AnimatePresence>
          {isFormOpen && (
            <ProductForm 
              isOpen={isFormOpen} 
              onClose={() => setIsFormOpen(false)} 
              onAdd={addProduct} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {zoomedImage && (
            <ImageModal 
              src={zoomedImage} 
              isOpen={!!zoomedImage} 
              onClose={() => setZoomedImage(null)} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedProduct && (
            <ProductDetailModal 
              product={selectedProduct} 
              isOpen={!!selectedProduct} 
              onClose={() => setSelectedProduct(null)} 
              showPrice={!!user}
              onAddToCart={addToCart}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCartOpen && (
            <CartModal 
              items={cartItems}
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              onRemove={(id) => setCartItems(prev => prev.filter(p => p.id !== id))}
              onClear={() => setCartItems([])}
            />
          )}
        </AnimatePresence>

        {/* Print Only Section */}
        <div id="print-catalog" className="hidden print:block p-8 bg-white">
          <div className="flex items-center justify-between border-b-2 border-orange-500 pb-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-2xl">O</div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter">ORANGE PART'S</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-black">Catálogo de Produtos</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Gerado em</p>
              <p className="text-sm font-black">{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          <div className="print-grid">
            {products.map(product => (
              <div key={product.id} className="print-card space-y-3">
                <img src={product.image} alt="" className="w-full h-32 object-cover rounded-lg" />
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-black text-orange-500 uppercase">{product.code}</span>
                    <span className="text-[8px] font-black text-zinc-400 uppercase">{product.category}</span>
                  </div>
                  <h3 className="text-[10px] font-bold text-zinc-900 leading-tight line-clamp-2">{product.name}</h3>
                </div>
                <div className="space-y-1 pt-2 border-t border-zinc-100">
                  <div className="flex justify-between text-[8px]">
                    <span className="text-zinc-400 font-bold uppercase">Marca</span>
                    <span className="text-zinc-900 font-bold">{product.brand}</span>
                  </div>
                  <div className="flex justify-between text-[8px]">
                    <span className="text-zinc-400 font-bold uppercase">Posição</span>
                    <span className="text-zinc-900 font-bold">{product.position}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-[7px] font-black text-zinc-400 uppercase block">Aplicação</span>
                    <p className="text-[8px] text-zinc-600 line-clamp-2 leading-tight">{product.application}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-100 text-center">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">www.orangeparts.com.br</p>
          </div>
        </div>

        {/* Floating Actions */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40 no-print">
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-14 h-14 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-2xl shadow-2xl flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all border border-zinc-200 dark:border-zinc-800"
              >
                <ArrowUp className="w-6 h-6" />
              </motion.button>
            )}
          </AnimatePresence>
          
          <button className="w-16 h-16 bg-green-500 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110 active:scale-95 group relative">
            <MessageCircle className="w-8 h-8" />
            <span className="absolute right-full mr-6 bg-zinc-900 text-white text-[10px] font-black px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none uppercase tracking-widest translate-x-4 group-hover:translate-x-0 shadow-xl">
              Falar com Vendedor
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
