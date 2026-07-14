document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Scroll Reveal Animation
  const reveals = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    });
  }, revealOptions);

  reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
  });

  // Smooth Scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if(targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Login Form Handling
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const role = document.getElementById('role-select').value;
      if (!role) {
        alert("Please select a role before logging in.");
        return;
      }
      if (role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else if (role === 'user') {
        window.location.href = 'user-dashboard.html';
      }
    });
  }
  // Dashboard Tab Switching
  const sidebarLinks = document.querySelectorAll('.sidebar-menu a[data-tab]');
  if (sidebarLinks.length > 0) {
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links and tabs
        document.querySelectorAll('.sidebar-menu a').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Show corresponding tab
        const tabId = link.getAttribute('data-tab');
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
          targetTab.classList.add('active');
        }
      });
    });
  }
});


  // Dashboard Sidebar Toggle
  const dashMenuToggle = document.querySelector('.dashboard-menu-toggle');
  const dashSidebar = document.querySelector('.sidebar');
  const dashOverlay = document.querySelector('.sidebar-overlay');
  
  if (dashMenuToggle && dashSidebar && dashOverlay) {
    dashMenuToggle.addEventListener('click', () => {
      dashSidebar.classList.add('active');
      dashOverlay.classList.add('active');
    });
    
    dashOverlay.addEventListener('click', () => {
      dashSidebar.classList.remove('active');
      dashOverlay.classList.remove('active');
    });
    
    // Close sidebar when a menu item is clicked
    const dashLinks = dashSidebar.querySelectorAll('.sidebar-menu a');
    dashLinks.forEach(link => {
      link.addEventListener('click', () => {
        if(window.innerWidth <= 768) {
          dashSidebar.classList.remove('active');
          dashOverlay.classList.remove('active');
        }
      });
    });
  }



  // Dashboard Sidebar Close Button
  const dashCloseBtn = document.querySelector('.sidebar-close-btn');
  if (dashCloseBtn && dashSidebar && dashOverlay) {
    dashCloseBtn.addEventListener('click', () => {
      dashSidebar.classList.remove('active');
      dashOverlay.classList.remove('active');
    });
  }



// Page Loader Hide
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => { loader.style.display = 'none'; }, 500);
  }
});


// Animated Stat Counters globally
document.addEventListener('DOMContentLoaded', () => {
  // Target classes typically used for large stats
  const statSelectors = '.stat-number, .value, .stat-card h4, .stat-card h3, .analytics-box h4';
  const statElements = document.querySelectorAll(statSelectors);

  const animateValue = (obj, start, end, duration, prefix, suffix, decimals, hasComma) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      // easeOut effect
      const p = Math.min((timestamp - startTimestamp) / duration, 1);
      const progress = 1 - Math.pow(1 - p, 3); 
      
      let currentVal = progress * (end - start) + start;
      
      if (decimals === 0) {
        currentVal = Math.floor(currentVal);
      } else {
        currentVal = currentVal.toFixed(decimals);
      }
      
      let displayVal = currentVal.toString();
      if (hasComma) {
        displayVal = parseInt(currentVal).toLocaleString();
      }
      
      obj.textContent = prefix + displayVal + suffix;
      
      if (p < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Ensure exact final value
        let finalDisplay = decimals > 0 ? end.toFixed(decimals) : end;
        if (hasComma) finalDisplay = parseInt(end).toLocaleString();
        obj.textContent = prefix + finalDisplay + suffix;
      }
    };
    window.requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        
        // Don't animate if we already did or if it's purely text
        if (el.dataset.animated) return;
        el.dataset.animated = 'true';
        
        // Regex to extract prefix, number (with commas/dots), suffix
        const regex = /^([^\d\-]*)([\d\.,]+)(.*)$/;
        const match = text.match(regex);
        
        if (match) {
          const prefix = match[1] || '';
          const numStr = match[2];
          const suffix = match[3] || '';
          
          const hasComma = numStr.includes(',');
          const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
          
          const cleanNumStr = numStr.replace(/,/g, '');
          const endVal = decimals > 0 ? parseFloat(cleanNumStr) : parseInt(cleanNumStr, 10);
          
          if (!isNaN(endVal)) {
            // Set initial state
            el.textContent = prefix + '0' + suffix;
            animateValue(el, 0, endVal, 2000, prefix, suffix, decimals, hasComma);
          }
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  statElements.forEach(el => {
    counterObserver.observe(el);
  });
});

