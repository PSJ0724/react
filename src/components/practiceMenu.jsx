import React, { useState, useEffect, useRef } from 'react';
const PracticeMenuWithOptions = () => {
  // 기존 상태들
  const [activeTab, setActiveTab] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState({});
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const [isTabClickBlocked, setIsTabClickBlocked] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [realIndex, setRealIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [sliderImages] = useState([
    "https://c.animaapp.com/PyozDVQK/img/top-container@2x.png",
    "https://c.animaapp.com/PyozDVQK/img/top-container@2x.png",
    "https://c.animaapp.com/PyozDVQK/img/top-container@2x.png",
    "https://c.animaapp.com/PyozDVQK/img/top-container@2x.png",
    "https://c.animaapp.com/PyozDVQK/img/top-container@2x.png"
  ]);
  const extendedImages = [
    sliderImages[sliderImages.length - 1],
    ...sliderImages,
    sliderImages[0]
  ];
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ko');
  const [isNoticeExpanded, setIsNoticeExpanded] = useState(false);
  const [noticeHeight, setNoticeHeight] = useState('32px');
  const [isScrollListenerActive, setIsScrollListenerActive] = useState(true);

  // 옵션 관련 새로운 상태
  const [expandedMenus, setExpandedMenus] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantities, setQuantities] = useState({});

  // Refs
  const tabsRef = useRef(null);
  const tabRefs = useRef([]);
  const sectionRefs = useRef([]);
  const categoryHeaderRefs = useRef([]);
  const tabContainerRef = useRef(null);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const lastScrollTop = useRef(0);
  const scrollEndTimeoutRef = useRef(null);
  const tabClickBlockTimeoutRef = useRef(null);
  const noticeRef = useRef(null);
  const noticeContentRef = useRef(null);
  
  const categories = [
    '세트메뉴', '메인메뉴', '전골류', '계란', 
    '사이드', '추가메뉴', '콤보 시리즈'
  ];
  
  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'en', name: 'English' },
    { code: 'ko', name: '한국어' }
  ];
  
  // 허니콤보 메뉴 데이터
  const honeyComboData = {
    name: '허니콤보',
    description: '달콤한 허니소스와 바삭한 치킨의 완벽한 조화',
    price: '29,000원',
    options: {
      '음료 추가 선택': {
        type: 'required', //필수수
        items: [
          { name: '콜라 1.25L', price: 0 },
          { name: '사이다 1.25L', price: 0 },
          { name: '환타 1.25L', price: 0 }
        ]
      },
      '맵기 선택': {
        type: 'required',
        items: [
          { name: '순한맛', price: 0 },
          { name: '보통맛', price: 0 },
          { name: '매운맛', price: 0 }
        ]
      },
      '사이드메뉴 추가': {
        type: 'optional', //선택택
        items: [
          { name: '치킨무', price: 1000 },
          { name: '떡볶이', price: 3000 },
          { name: '감자튀김', price: 2500 }
        ]
      }
    }
  };

  // 기존 메뉴 데이터 수정 - 각 카테고리에 허니콤보 추가
  const menuData = {
    '세트메뉴': [
      { ...honeyComboData, hasOptions: true, id: 'honey-combo-1', options: honeyComboData.options},
      { name: '2인 SET', description: '낙차새 or 낙곱새 or 낙지볶음 + 폭탄계란찜 + 공기밥2개', price: '29,000원', soldOut: true },
      { name: '3인 SET', description: '낙차새 or 낙곱새 or 낙지볶음 + 폭탄계란찜 + 공기밥 3개', price: '39,000원' }
    ],
    '메인메뉴': [
      { ...honeyComboData, hasOptions: true, id: 'honey-combo-2', options: honeyComboData.options },
      { name: '양념치킨', description: '달콤한 양념소스에 버무린 바삭한 치킨', price: '20,000원' },
      { name: '후라이드', description: '바삭하고 고소한 클래식 치킨', price: '19,000원' }
    ],
    '전골류': [
      { ...honeyComboData, hasOptions: true, id: 'honey-combo-3', options: honeyComboData.options },
      { name: '부대찌개', description: '든든한 부대찌개와 라면사리', price: '25,000원' },
      { name: '김치찌개', description: '얼큰한 김치찌개와 공기밥', price: '23,000원' }
    ],
    '계란': [
      { ...honeyComboData, hasOptions: true, id: 'honey-combo-4', options: honeyComboData.options },
      { name: '계란찜', description: '폭신한 계란찜', price: '7,000원' },
      { name: '계란프라이', description: '고소한 계란프라이 3개', price: '5,000원' }
    ],
    '사이드': [
      { ...honeyComboData, hasOptions: true, id: 'honey-combo-5', options: honeyComboData.options },
      { name: '감자튀김', description: '바삭한 감자튀김', price: '4,000원' },
      { name: '치즈스틱', description: '쫄깃한 치즈스틱 5개', price: '6,000원' }
    ],
    '추가메뉴': [
      { ...honeyComboData, hasOptions: true, id: 'honey-combo-6', options: honeyComboData.options },
      { name: '공기밥', description: '갓 지은 공기밥', price: '2,000원' },
      { name: '음료수', description: '시원한 음료수', price: '2,500원' }
    ],
    '콤보 시리즈': [
      { ...honeyComboData, hasOptions: true, id: 'honey-combo-7', options: honeyComboData.options },
      { name: '치킨콤보', description: '치킨 + 음료 + 감자튀김', price: '25,000원' },
      { name: '패밀리콤보', description: '치킨 2마리 + 음료 2개 + 사이드 2개', price: '45,000원' }
    ]
  };

  // 메뉴 확장
  const expandMenu = (menuId) => {
    setExpandedMenus(prev => {
      if (prev[menuId]) return prev; // 이미 확장된 경우 그대로 유지
      
      // 해당 메뉴 찾기
      const menu = Object.values(menuData).flat().find(item => item.id === menuId);
      
      if (menu && menu.options) {
        // 필수 옵션들의 첫 번째 항목을 자동 선택
        const defaultSelections = {};
        
        Object.entries(menu.options).forEach(([optionTitle, optionData]) => {
          if (optionData.type === 'required' && optionData.items.length > 0) {
            defaultSelections[optionTitle] = optionData.items[0].name;
          }
        });
        
        // selectedOptions 업데이트
        setSelectedOptions(prevOptions => ({
          ...prevOptions,
          [menuId]: {
            ...prevOptions[menuId],
            ...defaultSelections
          }
        }));
      }
      
      return {
        ...prev,
        [menuId]: true
      };
    });
  };

  // 메뉴 축소
  const collapseMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: false
    }));
  };

  // 옵션 선택 처리
  const handleOptionSelect = (menuId, optionCategory, optionName, optionType) => {
    setSelectedOptions(prev => {
      const currentOptions = prev[menuId] || {};
      
      if (optionType === 'required') {
        // 필수 옵션: 단일 선택
        return {
          ...prev,
          [menuId]: {
            ...currentOptions,
            [optionCategory]: optionName
          }
        };
      } else {
        // 선택 옵션: 다중 선택
        const currentSelections = currentOptions[optionCategory] || [];
        const isSelected = currentSelections.includes(optionName);
        
        return {
          ...prev,
          [menuId]: {
            ...currentOptions,
            [optionCategory]: isSelected 
              ? currentSelections.filter(name => name !== optionName)
              : [...currentSelections, optionName]
          }
        };
      }
    });
  };

  // 수량 증가
  const increaseQuantity = (menuId) => {
    setQuantities(prev => ({
      ...prev,
      [menuId]: (prev[menuId] || 1) + 1
    }));
  };

  // 수량 감소
  const decreaseQuantity = (menuId) => {
    setQuantities(prev => ({
      ...prev,
      [menuId]: Math.max(1, (prev[menuId] || 1) - 1)
    }));
  };

  // 선택한 옵션들의 총 가격 계산
  const calculateTotalPrice = (menuId) => {
    try {
      const menu = Object.values(menuData).flat().find(item => item.id === menuId);
      if (!menu) {
        console.log('Menu not found for id:', menuId);
        return 0;
      }
      
      const basePrice = parseInt(menu.price.replace(/[^0-9]/g, '')) || 0;
      const quantity = quantities[menuId] || 1;
      
      let optionsPrice = 0;
      const selections = selectedOptions[menuId] || {};
      
      if (menu.options) {
        Object.entries(menu.options).forEach(([optionTitle, optionData]) => {
          const selected = selections[optionTitle];
          
          if (optionData.type === 'required' && selected) {
            const option = optionData.items.find(item => item.name === selected);
            if (option && option.price) {
              optionsPrice += option.price;
            }
          } else if (optionData.type === 'optional' && Array.isArray(selected)) {
            selected.forEach(optionName => {
              const option = optionData.items.find(item => item.name === optionName);
              if (option && option.price) {
                optionsPrice += option.price;
              }
            });
          }
        });
      }
      
      const total = (basePrice + optionsPrice) * quantity;
      console.log('Price calculation:', { menuId, basePrice, optionsPrice, quantity, total });
      return total;
    } catch (error) {
      console.error('Error calculating price:', error);
      return 0;
    }
  };

  // 장바구니 추가 처리
  const handleAddToCart = (menuId, menuName) => {
    const options = selectedOptions[menuId] || {};
    const quantity = quantities[menuId] || 1;
    const totalPrice = calculateTotalPrice(menuId);
    console.log(`장바구니에 추가: ${menuName}`, { options, quantity, totalPrice });
    // 여기에 실제 장바구니 추가 로직 구현
  };

  // 하이라이트 위치 업데이트
  const updateHighlight = (tabIndex) => {
    if (tabRefs.current[tabIndex]) {
      const tab = tabRefs.current[tabIndex];
      const isCurrentlyActive = tab.classList.contains('active');
      
      if (isCurrentlyActive) {
        setHighlightStyle({
          left: tab.offsetLeft,
          width: tab.offsetWidth,
        });
        return;
      }
      
      const tabText = tab.innerText;
      const tempDiv = document.createElement('div');
      tempDiv.style.cssText = `
        position: absolute;
        visibility: hidden;
        font-size: 15px;
        font-weight: 700;
        white-space: nowrap;
        font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
        line-height: 18px;
        letter-spacing: 0;
      `;
      tempDiv.textContent = tabText;
      document.body.appendChild(tempDiv);
      
      const predictedWidth = tempDiv.offsetWidth;
      document.body.removeChild(tempDiv);
      
      const currentCenter = tab.offsetLeft + tab.offsetWidth / 2;
      const newLeft = currentCenter - predictedWidth / 2;
      
      setHighlightStyle({
        left: newLeft,
        width: predictedWidth,
      });
    }
  };

  // 탭을 화면 중앙으로 스크롤하는 함수
  const scrollTabToCenter = (tabIndex) => {
    const container = tabContainerRef.current;
    const tab = tabRefs.current[tabIndex];
    
    if (container && tab) {
      const containerWidth = container.offsetWidth;
      const tabLeft = tab.offsetLeft;
      const tabWidth = tab.offsetWidth;
      
      const tabCenter = tabLeft + (tabWidth / 2);
      const containerCenter = containerWidth / 2;
      const scrollLeft = tabCenter - containerCenter;
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // 탭 클릭 핸들러
  const handleTabClick = (index) => {
    if (isTabClickBlocked || isProgrammaticScroll) {
      return;
    }
    
    setIsProgrammaticScroll(true);
    setIsTabClickBlocked(true);
    setIsScrollListenerActive(false);
    setActiveTab(index);
    scrollTabToCenter(index);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    if (scrollEndTimeoutRef.current) {
      clearTimeout(scrollEndTimeoutRef.current);
    }
    if (tabClickBlockTimeoutRef.current) {
      clearTimeout(tabClickBlockTimeoutRef.current);
    }
    
    if (categoryHeaderRefs.current[index]) {
      setTimeout(() => {
        const tabsHeight = tabsRef.current?.offsetHeight || 51;
        const categoryBadgeContainer = categoryHeaderRefs.current[index];
        
        const rect = categoryBadgeContainer.getBoundingClientRect();
        const scrollTop = window.pageYOffset;
        const elementTop = rect.top + scrollTop;
        
        const targetPosition = elementTop - tabsHeight - 40;
        
        const scrollDistance = Math.abs(targetPosition - scrollTop);
        
        const scrollDuration = Math.min(Math.max(scrollDistance * 0.5, 400), 800);
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        scrollTimeoutRef.current = setTimeout(() => {
          setActiveTab(index);
          setIsProgrammaticScroll(false);
          setIsTabClickBlocked(false);
          
          setTimeout(() => {
            setIsScrollListenerActive(true);
          }, 500);
        }, scrollDuration + 300);
        
      }, 10);
    } else {
      setTimeout(() => {
        setIsProgrammaticScroll(false);
        setIsTabClickBlocked(false);
        
        setTimeout(() => {
          setIsScrollListenerActive(true);
        }, 500);
      }, 300);
    }
  };

  // 이미지 로딩 에러 처리
  const handleImageError = (index) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const handleImageLoad = (index) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [index]: false
    }));
  };

  const startAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(() => {
      if (!isDragging) {
        nextSlide();
      }
    }, 2500);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    const newSlide = index + 1;
    setCurrentSlide(newSlide);
    setRealIndex(index);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setCurrentSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setCurrentSlide(prev => prev - 1);
  };

  const handleDragStart = (clientX) => {
    setIsDragging(true);
    setDragStart(clientX);
    setDragOffset(0);
    stopAutoPlay();
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    const offset = clientX - dragStart;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const threshold = 50;
    
    if (dragOffset > threshold) {
      prevSlide();
    } else if (dragOffset < -threshold) {
      nextSlide();
    }
    
    setDragOffset(0);
    
    setTimeout(() => {
      startAutoPlay();
    }, 50);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  useEffect(() => {
    if (noticeRef.current) {
      if (isNoticeExpanded) {
        const contentHeight = noticeRef.current.scrollHeight;
        setNoticeHeight(`${contentHeight}px`);
      } else {
        setNoticeHeight('32px');
      }
    }
  }, [isNoticeExpanded]);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const tabsTop = tabsRef.current.offsetTop;
        const scrollTop = window.pageYOffset;
        setIsSticky(scrollTop > tabsTop);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleUserScroll = () => {
      if (!isScrollListenerActive) {
        return;
      }
      
      if (isProgrammaticScroll || isTabClickBlocked) {
        return;
      }
      
      const tabsHeight = tabsRef.current?.offsetHeight || 51;
      const triggerPoint = tabsHeight + 50;
      
      let newActiveTab = 0;
      
      for (let i = categoryHeaderRefs.current.length - 1; i >= 0; i--) {
        const categoryBadgeContainer = categoryHeaderRefs.current[i];
        if (categoryBadgeContainer) {
          const rect = categoryBadgeContainer.getBoundingClientRect();
          const badgeTop = rect.top;
          
          if (badgeTop <= triggerPoint) {
            newActiveTab = i;
            break;
          }
        }
      }
      
      if (newActiveTab !== activeTab && !isProgrammaticScroll && !isTabClickBlocked) {
        setActiveTab(newActiveTab);
        scrollTabToCenter(newActiveTab);
      }
      
    };
    
    window.addEventListener('scroll', handleUserScroll, { passive: true });
    
    setTimeout(handleUserScroll, 100);
    
    return () => {
      window.removeEventListener('scroll', handleUserScroll);
    };
  }, [activeTab, isProgrammaticScroll, isTabClickBlocked, isScrollListenerActive, categories]);

  useEffect(() => {
    updateHighlight(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollTabToCenter(0);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e) => handleMouseMove(e);
      const handleGlobalMouseUp = () => handleMouseUp();
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  useEffect(() => {
    if (!isDragging) {
      if (currentSlide === 0) {
        const timer = setTimeout(() => {
          setIsTransitioning(true);
          setCurrentSlide(sliderImages.length);
          setRealIndex(sliderImages.length - 1);
          setTimeout(() => setIsTransitioning(false), 25);
        }, 150);
        return () => clearTimeout(timer);
      } else if (currentSlide === extendedImages.length - 1) {
        const timer = setTimeout(() => {
          setIsTransitioning(true);
          setCurrentSlide(1);
          setRealIndex(0);
          setTimeout(() => setIsTransitioning(false), 25);
        }, 150);
        return () => clearTimeout(timer);
      } else if (currentSlide >= 1 && currentSlide <= sliderImages.length) {
        setRealIndex(currentSlide - 1);
      }
    }
  }, [currentSlide, isDragging, sliderImages.length, extendedImages.length]);

  useEffect(() => {
    const scaleUI = () => {
      const wrapper = document.querySelector('.scale-wrapper');
      if (wrapper) {
        const viewportWidth = window.innerWidth;
        const scale = Math.min(viewportWidth / 360, 1.5);
        wrapper.style.zoom = scale;
      }
    };

    scaleUI();
    window.addEventListener('resize', scaleUI);
    return () => window.removeEventListener('resize', scaleUI);
  }, []);

  useEffect(() => {
    if (isProgrammaticScroll) {
      const handleUserInterrupt = (e) => {
        if (e.type === 'wheel' || e.type === 'touchmove') {
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
          scrollTimeoutRef.current = setTimeout(() => {
            setIsProgrammaticScroll(false);
            setIsTabClickBlocked(false);
            setIsScrollListenerActive(true);
          }, 100);
        }
      };
      
      window.addEventListener('wheel', handleUserInterrupt, { passive: true });
      window.addEventListener('touchmove', handleUserInterrupt, { passive: true });
      
      return () => {
        window.removeEventListener('wheel', handleUserInterrupt);
        window.removeEventListener('touchmove', handleUserInterrupt);
      };
    }
  }, [isProgrammaticScroll]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current);
      }
      if (tabClickBlockTimeoutRef.current) {
        clearTimeout(tabClickBlockTimeoutRef.current);
      }
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);

  return (
    <>
      <head jsx>{`<meta name="theme-color" content="#FFAS3D">`}</head>
      <style jsx>{`

          @font-face {
            font-family: 'Pretendard';
            src: url('https://woworderfontsbucket.s3.ap-northeast-2.amazonaws.com/PretendardVariable.woff2') format('woff2-variations'),
            font-display: swap;
            font-weight: 100 900; /* Variable font 범위 */
          }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
          -webkit-tap-highlight-color: transparent;
          -webkit-text-size-adjust:none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        
        body {
          background-color: #ffffff;
          overflow-x: hidden;
        }
        
        .scale-wrapper {
          width: 360px;
          transform-origin: top center;
          margin: 0 auto;
          position: relative;
        }
        
        @media screen and (min-width: 361px) {
          .scale-wrapper {
            zoom: calc(100vw / 360);
          }
        }
        
        @media screen and (min-width: 540px) {
          .scale-wrapper {
            zoom: 1.5;
          }
        }

        .top-container {
          width: 360px;
          height: 229px;
          position: relative;
          overflow: hidden;
        }
        
        .image-slider {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          cursor: grab;
          user-select: none;
        }
        
        .image-slider.dragging {
          cursor: grabbing;
        }
        
        .slider-wrapper {
          display: flex;
          width: 700%;
          height: 100%;
          transition: transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform;
        }
        
        .slider-wrapper.no-transition {
          transition: none;
        }
        
        .slider-image {
          width: 14.285714%;
          height: 100%;
          object-fit: cover;
          flex-shrink: 0;
          pointer-events: none;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .image-placeholder {
          width: 14.285714%;
          height: 100%;
          background: linear-gradient(135deg, #FF6B35, #F7931E);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          flex-shrink: 0;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        
        .image-loading {
          width: 14.285714%;
          height: 100%;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #666;
          font-size: 12px;
        }

        .pagination-dots {
          display: flex;
          gap: 4px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 8px;
          z-index: 2;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: background-color 0.0375s ease;
        }

        .dot.active {
          background-color: rgba(255, 255, 255, 1);
        }

        .language-selector {
          position: absolute;
          top: 10px;
          right: 10px;
          height: 35px;
          border-radius: 12px;
          background-color: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          z-index: 3;
          transition: width 0.0375s cubic-bezier(0.4, 0, 0.2, 1) 0.0125s;
        }
        
        .language-selector.collapsed {
          width: 35px;
        }
        
        .language-selector.expanded {
          width: 256px;
          transition: width 0.04375s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .language-options {
          display: flex;
          align-items: center;
          height: 100%;
          white-space: nowrap;
          padding: 0 37px 0 12px;
          opacity: 0;
          transition: opacity 0.03125s ease;
          flex: 1;
          gap: 18px;
        }
        
        .language-selector.expanded .language-options {
          opacity: 1;
          transition: opacity 0.0375s ease 0.01875s;
        }
        
        .language-selector.collapsed .language-options {
          opacity: 0;
          transition: opacity 0.01875s ease;
        }
        
        .language-option {
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.025s ease;
          user-select: none;
        }
        
        .language-option:hover {
          color: #333333;
        }
        
        .language-option.active {
          color: #000000;
          font-weight: 600;
        }
        
        .language-icon {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 19px;
          height: 19px;
          cursor: pointer;
          z-index: 10;
        }

        .main-container {
          width: 360px;
          min-height: 1068px;
          position: relative;
        }

        .store-info-container {
          padding: 16px 16px 4px 16px;
          width: 360px;
          box-sizing: border-box;
        }

        .store-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 328px;
          height: 31px;
          margin-bottom: 20px;
        }

        .store-name {
          width: 266px;
          height: 31px;
          font-size: 26px;
          font-weight: 700;
          color: #000000;
          line-height: 31px;
          letter-spacing: 0;
        }

        .table-badge {
          width: 62px;
          height: 24px;
          background-color: #f1f1f1;
          color: #959595;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 400;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 14px;
        }

        .action-buttons {
          display: flex;
          gap: 13px;
          width: 328px;
          height: 62px;
          margin-bottom: 0px;
        }

        .action-btn {
          width: 62px;
          height: 62px;
          background-color: #ffffff;
          border-radius: 20px;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 5px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }

        .action-btn img {
          width: 36px;
          height: 36px;
        }

        .action-btn span {
          font-size: 9px;
          font-weight: 500;
          color: #000000;
          line-height: 11px;
          text-align: center;
        }

        .live-status {
          width: 178px;
          height: 62px;
          background: linear-gradient(97deg, rgba(249, 206, 52, 0.1) 0%, rgba(238, 42, 123, 0.02) 48%, rgba(98, 40, 215, 0.1) 100%);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative; 
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
        }

        .live-status::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1px;
          background: linear-gradient(97deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%);
          border-radius: 16px;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
        }

        .live-status img {
          width: 30px;
          height: 30px;
          margin-bottom: 2px;
        }

        .live-status span {
          font-size: 10px;
          font-weight: 700;
          background: linear-gradient(97deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          line-height: 12px;
        }

        .notice-container {
          width: 360px;
          padding: 14px 16px;
          margin: 0;
          box-sizing: border-box;
          border-bottom: 8px solid #f3f5f7;
        }

        .notice {
          width: 328px;
          min-height: 32px;
          height: 32px;
          padding: 8px 12px;
          border: 1px solid #d2d2d2;
          border-radius: 8px;
          background-color: #ffffff;
          display: flex;
          align-items: flex-start;
          position: relative;
          cursor: pointer;
          transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        
        .notice.expanded {
          height: auto;
        }

        .notice-content {
          display: flex;
          align-items: flex-start;
          gap: 4px;
          width: calc(100% - 20px);
        }
        
        .notice-expand-btn {
          position: absolute;
          right: 12px;
          top: 13px;
          width: 10.54px;
          height: 6.07px;
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDExIDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNS41IDVMMTAgMSIgc3Ryb2tlPSIjQTBBMEEwIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=') no-repeat center;
          background-size: contain;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }
        
        .notice.expanded .notice-expand-btn {
          transform: rotate(180deg);
        }

        .notice-icon {
          width: 14px;
          height: 14px;
          position: relative;
          flex-shrink: 0;
          margin-top: 0;
        }

        .notice-text {
          flex: 1;
          font-size: 11px;
          font-weight: 500;
          color: #000000;
          line-height: 15px;
          letter-spacing: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        
        .notice.expanded .notice-text {
          -webkit-line-clamp: unset;
          line-clamp: unset;
          white-space: normal;
          max-height: none;
        }

        .category-container {
          position: sticky;
          position: -webkit-sticky;
          top: 0;
          width: 360px;
          height: 51px;
          background-color: #ffffff;
          z-index: 1000;
          transition: all 0.0375s ease;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          will-change: transform;
          margin: 0 auto;
          left: 0;
          right: 0;
        }
        
        .category-container::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: #f3f5f7;
        }
        
        .category-tabs {
          display: flex;
          gap: 20px;
          padding: 16px 16px 16px 16px;
          height: 50px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          align-items: center;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          position: relative;
        }
        
        .category-tabs.blocked {
          pointer-events: none;
        }

        .category-tabs::-webkit-scrollbar {
          display: none;
        }

        .category-tab {
          font-size: 14px;
          font-weight: 500;
          color: #797979;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.025s ease;
          height: 17px;
          line-height: 17px;
          letter-spacing: 0;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        
        .category-tab.disabled {
          cursor: not-allowed;
        }

        .category-tab.active {
          font-size: 15px;
          font-weight: 700;
          color: #000000;
          height: 18px;
          line-height: 18px;
        }

        .category-highlight {
          position: absolute;
          bottom: 0px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #000000;
          border-radius: 10px;
          transition: all 0.0375s ease;
          z-index: 1;
          pointer-events: none;
        }

        .menu-display-container {
          width: 360px;
          position: relative;
          padding-top: 6px;
        }

        .menu-container {
          width: 360px;
          position: relative;
          padding-top: 4px;
        }
        
        .menu-container:not(:last-child)::after {
          content: '';
          display: block;
          width: 100%;
          height: 10px;
          background-color: #f3f5f7;
        }
        
        .menu-container:last-child {
          margin-bottom: 0;
        }

        .menu-container:first-child {
          padding-top: 0;
        }

        .category-badge-container {
          padding: 18px 16px 4px 20px;
        }
        
        .category-badge {
          background-color: #f1f1f1;
          color: #000000;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          display: inline-block;
          width: auto;
          height: auto;
          line-height: 19px;
          text-align: center;
          white-space: nowrap;
        }

        .menu-item {
          display: flex;
          flex-direction: column;
          padding: 16px 16px 4px 16px;
          width: 360px;
          border-bottom: 1px solid #f3f5f7;
          transition: all 0.3s ease;
        }
        
        .menu-item.expandable {
          cursor: pointer;
        }
        
        .menu-item.expandable.expanded {
          cursor: default;
        }
        
        .menu-item.expanded {
        }
        
        .menu-container .menu-item:last-child {
          border-bottom: none;
        }
        
        .menu-item-basic {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          width: 100%;
        }

        .menu-info {
          width: 234px;
          min-height: 70px;
          padding-top: 4px;
          height: auto;
          display: flex;
          flex-direction: column;
        }

        .menu-tags {
          display: flex;
          gap: 5px;
          width: auto;
          min-height: 16px;
          margin-bottom: 8px;
        }
        
        .menu-tags:empty {
          margin-bottom: 0;
          min-height: 0;
        }

        .menu-name {
          width: 206px;
          height: 19px;
          font-size: 16px;
          font-weight: 700;
          color: #000000;
          margin-bottom: 6px;
          line-height: 19px;
          letter-spacing: 0;
        }

        .menu-description {
          width: 206px;
          height: auto;
          font-size: 12px;
          font-weight: 500;
          color: #949494;
          line-height: 18px;
          margin-bottom: 14px;
          letter-spacing: -0.24px;
        }

        .menu-price {
          width: 206px;
          height: 18px;
          font-size: 15px;
          font-weight: 600;
          color: #000000;
          line-height: 18px;
          letter-spacing: 0;
        }

        .menu-image-container {
          position: relative;
          width: 94px;
          height: 94px;
        }

        .menu-image {
          width: 94px;
          height: 94px;
          object-fit: cover;
        }

        .sold-out-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 94px;
          height: 94px;
          background-color: rgba(255, 255, 255, 0.7);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sold-out-badge {
          background-color: rgba(0, 0, 0, 0.4);
          color: #ffffff;
          width: 37px;
          height: 20px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 14px;
        }

        .menu-item.sold-out .menu-name,
        .menu-item.sold-out .menu-description,
        .menu-item.sold-out .menu-price {
          color: #C4C4C4;
        }

        /* 옵션 관련 스타일 */
        .menu-options {
          width: 100%;
          margin-top: 4px;
          border: 1px solid #EEEEEE;
          border-radius: 10px;
          position: relative;
          overflow: visible;
          animation: expandMenu 0.3s ease-out;
        }
        
        @keyframes expandMenu {
          from {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 1000px;
          }
        }
        
        .options-close-button {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          cursor: pointer;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .options-close-button:hover {
          transform: translateX(-50%) scale(1.05);
        }
        
        .options-close-button:active {
          transform: translateX(-50%) scale(0.95);
        }
        
        .option-section:not(:last-child)::after {
            content : '';
            display: block;
            width: 100%;
            background: #EEEEEE;
            height: 1px;
            
        }

        .option-section-padding {
          padding: 26px 16px 12px 16px;
        }
        .option-section {
        }
        
        .option-section:last-child {
          margin-bottom: 0;
        }
        
        .option-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }
        
        .option-title {
          font-size: 16px;
          font-weight: 700;
          color: #191919;
          line-height: 19px;
        }
        
        .option-badge {
          padding: 3px 5px;
          border-radius: 13px;
          font-size: 10px;
          font-weight: 700;
          line-height: 12px;
        }
        
        .option-badge.required {
          background-color: #fff4d2;
          color: #ffbb00;
        }
        
        .option-badge.optional {
          background-color: #f4f4f4;
          color: #999999;
        }
        
        .option-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 11px 0px 10px 0px;
        }
        
        .option-item-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .option-radio {
          width: 18px;
          height: 18px;
          /* SVG는 여기에 넣어주세요 */
        }
        
        .option-checkbox {
          width: 18px;
          height: 18px;
          /* SVG는 여기에 넣어주세요 */
        }
        
        .option-name {
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          line-height: 17px;
        }
        
        .option-price {
          font-size: 14px;
          font-weight: 600;
          color: #000000;
          line-height: 17px;
        }
        
        .cart-button-container {
          width: 100%;
          padding-top: 18px;
          padding-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 11px;
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          width: 119px;
          height: 49px;
          background-color: #FFFFFF;
          border: 1px solid #D9D9D9;
          border-radius: 8px;
          padding: 0 4px;
        }
        
        .quantity-button {
          width: 32px;
          height: 32px;
          border: none;
          background-color: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #666666;
          transition: all 0.2s;
          border-radius: 4px;
        }
        .quantity-button:disabled {
          pointer-events: none;
        }
        
        /*'-' 버튼 비 호버 상태일 때*/
        .quantity-button:not(:disabled):hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        /*'-' 버튼 비활성화 상태일 때*/
        .quantity-button:not(:disabled):active {
          background-color: rgba(0, 0, 0, 0.1);
        }

        .quantity-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .quantity-button:active {
          background-color: rgba(0, 0, 0, 0.1);
        }
        
        .quantity-display {
          min-width: 46px;
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          padding: 0 2px;
        }
        
        .cart-button {
          flex: 1;
          height: 49px;
          background-color: #fdcd27;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }
        
        .cart-button:hover {
          background-color: #f5c116;
        }
        
        .cart-button:active {
          background-color: #e6b60f;
        }

        .white-spacer {
          width: 360px;
          height: 26px;
          background-color: #ffffff;
        }

        .bottom-info {
          background-color: #f3f5f7;
          padding: 30px 16px 160px;
          width: 360px;
          min-height: 374px;
        }

        .info-section {
          width: 328px;
          margin-bottom: 20px;
        }

        .info-title {
          width: 328px;
          height: 16px;
          font-size: 13px;
          font-weight: 700;
          color: #6e6e6e;
          margin-bottom: 6px;
          line-height: 16px;
          letter-spacing: 0;
        }

        .info-content {
          width: 328px;
          font-size: 13px;
          font-weight: 400;
          color: #949494;
          line-height: 20px;
          letter-spacing: 0;
        }

        .fixed-bottom {
          background-image: url(https://woworderbucket.s3.ap-northeast-2.amazonaws.com/bottomNav.png);
          padding-top: 39px;
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 360px;
          height: 100px;
          display: flex;
          justify-content: center;
          z-index: 1000;
        }

        .bottom-button {
          width: 328px;
          height: 50px;
          background-color: #fdcd27;
          border-radius: 10px;
          border: none;
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          letter-spacing: -0.32px;
          line-height: 19px;
        }

        .cart-count {
          background-color: #ffffff;
          color: #fdcd27;
          width: 22px;
          height: 22px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 700;
          line-height: 18px;
        }

        .navigation-bar {
          width: 360px;
          height: 42px;
          background-image: url('https://c.animaapp.com/PyozDVQK/img/navigation-bar@2x.png');
          background-size: cover;
          background-position: center;
          position: fixed;
          bottom: 72px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999;
        }
      `}</style>
      
      <div className="scale-wrapper">
        {/* Top Container */}
        <div className="top-container">
          {/* Image Slider */}
          <div 
            className={`image-slider ${isDragging ? 'dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className={`slider-wrapper ${isDragging || isTransitioning ? 'no-transition' : ''}`}
              style={{ 
                transform: `translateX(${-currentSlide * 14.285714 + (isDragging ? (dragOffset / 360) * 14.285714 : 0)}%)` 
              }}
            >
              {extendedImages.map((image, index) => {
                const isError = imageLoadErrors[index];
                
                if (isError) {
                  return (
                    <div key={`placeholder-${index}`} className="image-placeholder">
                      교촌치킨<br />이미지 {(index % sliderImages.length) + 1}
                    </div>
                  );
                }
                
                return (
                  <img
                    key={`extended-${index}`}
                    src={image}
                    alt={`이미지 ${(index % sliderImages.length) + 1}`}
                    className="slider-image"
                    draggable={false}
                    onError={() => handleImageError(index)}
                    onLoad={() => handleImageLoad(index)}
                    style={{
                      backgroundColor: '#f0f0f0'
                    }}
                  />
                );
              })}
            </div>
          </div>
          
          <div className="pagination-dots">
            {sliderImages.map((_, index) => (
              <div
                key={index}
                className={`dot ${realIndex === index ? 'active' : ''}`}
                onClick={() => {
                  goToSlide(index);
                  stopAutoPlay();
                  setTimeout(() => startAutoPlay(), 100);
                }}
              />
            ))}
          </div>
          
          <div 
            className={`language-selector ${isLanguageExpanded ? 'expanded' : 'collapsed'}`}
            onClick={() => setIsLanguageExpanded(!isLanguageExpanded)}
          >
            <div className="language-options">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className={`language-option ${selectedLanguage === lang.code ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLanguage(lang.code);
                    setTimeout(() => setIsLanguageExpanded(false), 100);
                  }}
                >
                  {lang.name}
                </div>
              ))}
            </div>
            <div className="language-icon">
                <img src="https://woworderbucket.s3.ap-northeast-2.amazonaws.com/languageicon.png" alt="언어" style={{ width: '19px', height: '19px' }} />

            </div>
          </div>
        </div>

        {/* Main Container */}
        <div className="main-container">
          {/* Store Info Container */}
          <div className="store-info-container">
            <div className="store-info">
              <text className="store-name">교촌치킨 방학점이라구</text>
              <div className="table-badge">3번 테이블</div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="action-btn">
                <img src="https://c.animaapp.com/PyozDVQK/img/---@2x.png" alt="직원호출" />
                <span>직원호출</span>
              </button>
              
              <div className="live-status">
                <img src="https://c.animaapp.com/PyozDVQK/img/----1@2x.png" alt="실시간" />
                <span>3명이 같이 음식을 담고 있어요!</span>
              </div>
              
              <button className="action-btn">
                <img src="https://c.animaapp.com/PyozDVQK/img/----2@2x.png" alt="주문내역" />
                <span>주문내역</span>
              </button>
            </div>
          </div>

          {/* Notice */}
          <div className="notice-container">
            <div 
              ref={noticeRef}
              className={`notice ${isNoticeExpanded ? 'expanded' : ''}`}
              onClick={() => setIsNoticeExpanded(!isNoticeExpanded)}
              style={{ height: noticeHeight }}
            >
              <div className="notice-content" ref={noticeContentRef}>
                
                <img className="notice-icon" src="https://woworderbucket.s3.ap-northeast-2.amazonaws.com/noticeicon.png" alt="공지" style={{ width: '14px', height: '14px' }} />
                
                <div className="notice-text">
                  반반콤보 재고 소진되었습니다. 다른 치킨을 주문하고 싶으신 분들은 다른 매장에 가서 추가 구매를 하거나 매장을 이용하실 분들은 장바구니에 메뉴를 담아주세요.
                </div>
              </div>
              <div className="notice-expand-btn"></div>
            </div>
          </div>

          {/* Category Container */}
          <div className="category-container" ref={tabsRef}>
            <div className={`category-tabs ${isTabClickBlocked ? 'blocked' : ''}`} ref={tabContainerRef}>
              {categories.map((category, index) => (
                <div
                  key={index}
                  ref={el => tabRefs.current[index] = el}
                  className={`category-tab ${activeTab === index ? 'active' : ''} ${isTabClickBlocked ? 'disabled' : ''}`}
                  onClick={() => handleTabClick(index)}
                >
                  {category}
                </div>
              ))}
              <div 
                className="category-highlight"
                style={highlightStyle}
              />
            </div>
          </div>

          {/* Menu Containers */}
          <div className="menu-display-container">
            {categories.map((category, categoryIndex) => (
              <div 
                key={category}
                className="menu-container"
                ref={el => sectionRefs.current[categoryIndex] = el}
              >
                <div 
                  className="category-badge-container"
                  ref={el => categoryHeaderRefs.current[categoryIndex] = el}
                >
                  <div className="category-badge">{category}</div>
                </div>
                {menuData[category].map((item, itemIndex) => (
                  <div 
                    key={itemIndex}
                    className={`menu-item ${item.soldOut ? 'sold-out' : ''} ${item.hasOptions ? 'expandable' : ''} ${expandedMenus[item.id] ? 'expanded' : ''}`}
                    onClick={item.hasOptions && !item.soldOut && !expandedMenus[item.id] ? () => expandMenu(item.id) : undefined}
                  >
                    <div className="menu-item-basic">
                      <div className="menu-info">
                        <div className="menu-tags"></div>
                        <div className="menu-name">{item.name}</div>
                        <div className="menu-description">{item.description}</div>
                        <div className="menu-price">{item.price}</div>
                      </div>
                      <div className="menu-image-container">
                        <img 
                          className="menu-image" 
                          src="https://c.animaapp.com/PyozDVQK/img/-------2@2x.png" 
                          alt={item.name} 
                        />
                        {item.soldOut && (
                          <div className="sold-out-overlay">
                            <div className="sold-out-badge">품절</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* 옵션 영역 */}
                    {item.hasOptions && expandedMenus[item.id] && (
                      <div className="menu-options">
                        {/* 닫기 버튼 */}
                        <div className="options-close-button" onClick={() => collapseMenu(item.id)}>
                          <svg width="36" height="30" viewBox="0 0 36 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="36" height="30" fill="white"/>
                            <path d="M27 7.5L18 15L9 7.5M27 15L18 22.5L9 15" stroke="url(#paint0_linear_2212_6936)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <defs>
                              <linearGradient id="paint0_linear_2212_6936" x1="18" y1="7.5" x2="18" y2="22.5" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#F2F2F2"/>
                                <stop offset="1" stopColor="#CFCFCF"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        
                        {Object.entries(item.options).map(([optionTitle, optionData]) => (
                          <div key={optionTitle} className="option-section">
                            <div className="option-section-padding">
                            <div className="option-header">
                              <span className="option-title">{optionTitle}</span>
                              <span className={`option-badge ${optionData.type === 'required' ? 'required' : 'optional'}`}>
                                {optionData.type === 'required' ? '필수' : '선택'}
                              </span>
                            </div>
                            {optionData.items.map((option, optionIndex) => (
                              <div key={optionIndex} className="option-item">
                                <div className="option-item-info">
                                  <div 
                                    className={optionData.type === 'required' ? 'option-radio' : 'option-checkbox'}
                                    onClick={() => handleOptionSelect(item.id, optionTitle, option.name, optionData.type)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    {/* 라디오 버튼 또는 체크박스 SVG */}
                                    {optionData.type === 'required' ? (
                                      // 라디오 버튼
                                      selectedOptions[item.id]?.[optionTitle] === option.name ? (
                                        <div style={{ width: '19px', height: '19px', backgroundColor: '#fdcd27', borderRadius: '50%', position: 'relative' }}>
                                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '9px', height: '9px', backgroundColor: '#fff', borderRadius: '50%' }}></div>
                                        </div>
                                      ) : (
                                        <div style={{ width: '19px', height: '19px', border: '2px solid #ddd', borderRadius: '50%' }}></div>
                                      )
                                    ) : (
                                      // 체크박스
                                      selectedOptions[item.id]?.[optionTitle]?.includes(option.name) ? (
                                        <div style={{ width: '19px', height: '19px', backgroundColor: '#fdcd27', border:'2px solid #ddd',borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path fillRule="evenodd" clipRule="evenodd" d="M10.7583 0.277256C10.9131 0.454634 11 0.695179 11 0.945992C11 1.19681 10.9131 1.43735 10.7583 1.61473L4.5713 8.70441C4.48954 8.79812 4.39247 8.87246 4.28563 8.92318C4.17879 8.9739 4.06428 9 3.94864 9C3.83299 9 3.71848 8.9739 3.61165 8.92318C3.50481 8.87246 3.40774 8.79812 3.32597 8.70441L0.252 5.18258C0.173161 5.09533 0.110277 4.99096 0.0670156 4.87556C0.0237547 4.76016 0.000983583 4.63604 3.11662e-05 4.51044C-0.000921251 4.38485 0.0199641 4.2603 0.0614684 4.14405C0.102973 4.02781 0.164265 3.9222 0.241769 3.83339C0.319272 3.74458 0.411435 3.67434 0.51288 3.62678C0.614325 3.57922 0.723019 3.55529 0.832622 3.55638C0.942225 3.55747 1.05054 3.58357 1.15125 3.63314C1.25196 3.68271 1.34304 3.75477 1.41919 3.84511L3.94836 6.74329L9.59058 0.277256C9.66724 0.189359 9.75826 0.119631 9.85844 0.0720587C9.95863 0.0244859 10.066 0 10.1745 0C10.2829 0 10.3903 0.0244859 10.4905 0.0720587C10.5906 0.119631 10.6817 0.189359 10.7583 0.277256Z" fill="white"/>
                                          </svg>

                                        </div>
                                      ) : (
                                        <div style={{ width: '19px', height: '19px', border: '2px solid #ddd', borderRadius: '4px' }}></div>
                                      )
                                    )}
                                  </div>
                                  <span className="option-name">{option.name}</span>
                                </div>
                                <span className="option-price">{option.price > 0 ? `+${option.price.toLocaleString()}원` : '+0원'}</span>
                              </div>
                            ))}
                            
                            </div>
                          </div>
                        ))}
                        
                       
                        
                       
                      </div>
                    )}
                  {/* 장바구니 담기 버튼 */}
                  {item.hasOptions && expandedMenus[item.id] && (

                    <div className="cart-button-container">
                    <div className="quantity-selector">
                    <button 
                      className="quantity-button"
                      onClick={() => decreaseQuantity(item.id)}
                      disabled={(quantities[item.id] || 1) === 1}
                      style={{
                        opacity: (quantities[item.id] || 1) === 1 ? 0.3 : 1,
                        cursor: (quantities[item.id] || 1) === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      −
                    </button>
                      <div className="quantity-display">
                        {quantities[item.id] || 1}개
                      </div>
                      <button 
                        className="quantity-button"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="cart-button"
                      onClick={() => handleAddToCart(item.id, item.name)}
                    >
                      {calculateTotalPrice(item.id).toLocaleString()}원 담기
                    </button>
                    </div>
                  )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* White Spacer Box */}
        <div className="white-spacer"></div>

        {/* Bottom Info */}
        <div className="bottom-info">
          <div className="info-section">
            <div className="info-title">사업자 정보</div>
            <div className="info-content">
              상호명 : 교촌치킨<br />
              주소 : 서울 용산구 한강대로23길 55<br />
              전화번호 : 02-2012-0433<br />
              사업자등록번호 : 529-87-01160
            </div>
          </div>
          
          <div className="info-section">
            <div className="info-title">원산지 정보</div>
            <div className="info-content">
              쌀 (국내산) , 대창 (국내산 한우) , 낙지 (중국) , 차돌박이 (호주) , 배추김치 (중국)
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="navigation-bar"></div>

        {/* Fixed Bottom Button */}
        <div className="fixed-bottom">
          <button className="bottom-button">
            <div className="cart-count">3</div>
            30,900원 담겼어요
          </button>
        </div>
      </div>
    </>
  );
};

export default PracticeMenuWithOptions;