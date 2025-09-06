import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import PageButtons from '@/components/PageButtons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchUsers, searchTitlesByName } from '@/store/slices/titleEntrySlice';
import { Link } from "react-router-dom";
import { UserDataModel } from '@/core/models/user/userDataModel';

const Header = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const titleEntryState = useSelector((state: RootState) => state.titleEntry);
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [highlight, setHighlight] = useState<number>(-1);
  const [open, setOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<'title' | 'user'>('title');
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<UserDataModel[]>([]);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const isActive = (p: string) =>
    location.pathname === p || location.pathname.startsWith(p + "/");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [])

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const { id } = JSON.parse(userString);
      if (id) {
        setIsLogin(true);
      }
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const pages = [
    { name: 'Market', path: '/market' },
    { name: 'İlanlar', path: '/ads' },
    { name: 'Eğitimler', path: '/educations' },
    { name: 'Partnerlerimiz', path: '/partners' },
  ];

  useEffect(() => {
    console.log("user", user)
  }, [])


  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlight(-1);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);


  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    if (q.length < 2) {
      setOpen(false);
      if (searchMode === 'user') setFilteredUsers([]);
      return;
    }

    const t = setTimeout(() => {
      if (searchMode === 'title') {
        dispatch(searchTitlesByName({ name: q }));
      } else if (searchMode === 'user') {
        const filtered = (titleEntryState.users ?? []).filter(u =>
          (u.userName ?? u.username ?? "").toLowerCase().includes(q)
        );
        setFilteredUsers(filtered);
      }
      setOpen(true);
    }, 300);

    return () => clearTimeout(t);
  }, [searchTerm, dispatch, searchMode, titleEntryState.users]);



  const handleSelect = (name: string, headerId?: number) => {
    setOpen(false);
    setHighlight(-1);
    setSearchTerm('');
    const qs = headerId != null
      ? `/?search=${encodeURIComponent(name)}&headerId=${headerId}`
      : `/?search=${encodeURIComponent(name)}`;
    navigate(qs);
  };


  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const list = titleEntryState.titles ?? [];
    if (!open || list.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % list.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + list.length) % list.length);
    } else if (e.key === "Enter") {
      if (highlight >= 0 && highlight < list.length) {
        e.preventDefault();
        const item = list[highlight];
        handleSelect(item.name, item.headerId);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlight(-1);
    }
  };


  const handleSearchSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;

    const list = titleEntryState.titles ?? [];
    const exact = list.find(x => x.name === q);
    const ci = exact ?? list.find(x => x.name.toLowerCase() === q.toLowerCase());

    if (ci) {
      handleSelect(ci.name, ci.headerId);
    } else {
      handleSelect(q);
    }
  };


  return (
    <header className="bg-[#000000FF] text-[#FDF6EC] shadow-md fixed top-0 left-0 w-full z-50 
      px-4 md:px-6 h-auto md:h-[72px] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 py-3 md:py-0">

      <div className="flex items-center md:flex-row md:items-center gap-3 md:gap-6 w-full">
        <div
          className="flex items-center gap-4 cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          <div className="w-12 h-12 md:w-28 md:h-28 rounded-full overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
          </div>

          <h1
            className="hidden md:block text-2xl font-bold tracking-wide select-none leading-none"
            style={{ fontFamily: 'system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            HİPOCAPP
          </h1>
        </div>

        <div className="relative w-full md:w-64 md:mr-9 mt-2 md:mt-0" ref={boxRef}>
          <form onSubmit={handleSearchSubmit} role="search">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder={searchMode === 'title' ? "Başlık ara..." : "Kullanıcı ara..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.trim().length >= 2 && setOpen(true)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                className="w-full rounded-md border border-gray-300 py-1.5 pl-4 pr-16 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#2B4560] placeholder-black"
              />
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setSearchMode('title')}
                  className={`p-1 rounded ${searchMode === 'title' ? 'bg-gray-200' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchMode('user')}
                  className={`p-1 rounded ${searchMode === 'user' ? 'bg-gray-200' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M5.121 17.804A12.054 12.054 0 0112 15c2.21 0 4.28.606 6.121 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>

          {open && (
            <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-80 overflow-auto">
              {searchMode === 'title' && (
                <>
                  {titleEntryState.loading && <div className="px-4 py-2 text-sm text-gray-500">Yükleniyor…</div>}
                  {!titleEntryState.loading && titleEntryState.titles?.length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-500">Sonuç yok</div>
                  )}
                  {!titleEntryState.loading &&
                    titleEntryState.titles?.map((item, idx) => (
                      <button
                        key={item.id ?? item.name ?? idx}
                        type="button"
                        onClick={() => handleSelect(item.name, item.headerId)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-black"
                      >
                        {item.name}
                      </button>
                    ))
                  }
                </>
              )}

              {searchMode === 'user' && (
                <>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, idx) => {
                      const userName = user.username ?? "İsimsiz kullanıcı";
                      return (
                        <button
                          key={user.id ?? idx}
                          type="button"
                          onClick={() => {
                            if (isLogin) {
                              navigate(`/chat/${userName}`);
                            } else {
                              alert("Önce giriş yapmalısınız!");
                            }
                            setOpen(false);
                            setHighlight(-1);
                            setSearchTerm("");
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-black"
                        >
                          {userName}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">Kullanıcı bulunamadı</div>
                  )}
                </>
              )}


            </div>
          )}
        </div>

        <nav className="hidden md:flex items-center gap-5">
          {pages.map(({ name, path }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={[
                  "group relative w-32 px-4 py-1 rounded-md text-sm font-semibold select-none overflow-hidden",
                  "transition-all duration-300 ease-out focus:outline-none",
                  "bg-[#000000] ring-1 ring-[#7C3AED]/55",
                  active
                    ? "text-white shadow-[0_10px_24px_rgba(124,58,237,0.35)]"
                    : "text-white/85 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(124,58,237,0.35)]",
                  "focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                ].join(" ")}
              >
                <span className="relative z-10">{name}</span>
                <span
                  className={[
                    "pointer-events-none absolute inset-0 rounded-md",
                    "bg-[linear-gradient(135deg,#7C3AED_0%,#5B21B6_100%)]",
                    "transform transition-transform duration-300",
                    active ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"
                  ].join(" ")}
                />
                <span
                  className="pointer-events-none absolute inset-x-0 -top-6 h-12 rounded-md
      bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </button>
            );

          })}
        </nav>
      </div>
      <div className="flex items-center gap-3 md:gap-4 ml-2 md:ml-6">

        {user === null ? (
          <>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 rounded-md bg-[#000000FF] text-white shadow-md 
    font-semibold text-[10px] sm:text-[11px] md:text-[12px] 
    border-b-2 border-transparent hover:border-[#0071E3] transition-colors
    whitespace-nowrap"
              >
                Giriş Yap
              </button>


              <button
                onClick={() => navigate('/sign-up')}
                className="px-3 py-1.5 rounded-md bg-[#000000FF] text-white shadow-md 
      font-semibold text-[10px] sm:text-[11px] md:text-[12px] 
      border-b-2 border-transparent hover:border-[#0071E3] transition-colors"
              >
                Kaydol
              </button>
            </div>

          </>

        ) : (
          <>
            {/* Chat ikonu */}
            <div className="relative">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/chat');
                }}
                className="p-2 rounded-full hover:bg-[#000000FF] transition-colors"
                title="Mesajlar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white hover:text-[#0071E3]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.518 0-2.94-.336-4.162-.93L3 20l1.07-3.276C3.388 15.982 3 14.538 3 13c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1 bg-[#000000FF] hover:bg-[#000000FF] px-4 py-2 rounded-md shadow-md font-semibold
        transition-colors focus:outline-none border-b-2 border-transparent hover:border-[#0071E3]"
                aria-expanded={menuOpen}
              >
                {user.username}
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition text-sm"
                  >
                    Profil
                  </button>

                  {user.rolId === 1 && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition text-sm"
                    >
                      Admin Paneli
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition text-sm"
                  >
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
