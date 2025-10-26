    // Particles Background
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    function init() {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      particlesArray = [];
      for (let i = 0; i < 100; i++) {
        const size = Math.random() * 2;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const dx = (Math.random() - 0.5) * 1;
        const dy = (Math.random() - 0.5) * 1;
        particlesArray.push({ x, y, dx, dy, size });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let p of particlesArray) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#00d9ff';
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;

        // Rebond sur les bords
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        // Relier les particules proches
        for (let q of particlesArray) {
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,217,255,${1 - dist / 100})`;
            ctx.lineWidth = 0.3;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    init();
    animate();

    // Scroll animation
    window.addEventListener('scroll', () => {
      const reveals = document.querySelectorAll('.reveal');
      for (let el of reveals) {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        if (revealTop < windowHeight - 100) {
          el.classList.add('active');
        }
      }

      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    });

    // Form submission
    document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Merci pour votre message! Je vous répondrai dans les plus brefs délais.');
      this.reset();
    });

    // Animate skill bars on scroll
    function animateSkillBars() {
      const skillLevels = document.querySelectorAll('.skill-level');
      skillLevels.forEach(level => {
        const width = level.style.width;
        level.style.width = '0';
        setTimeout(() => {
          level.style.width = width;
        }, 300);
      });
    }

    // Initialize animations when skills section is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkillBars();
        }
      });
    });

    const skillsSection = document.getElementById('competences');
    if (skillsSection) {
      observer.observe(skillsSection);
    }

    // Animate math skill bars
    const mathObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const mathSkills = document.querySelectorAll('.math-skill');
          mathSkills.forEach(skill => {
            const width = skill.style.width;
            skill.style.width = '0';
            setTimeout(() => {
              skill.style.width = width;
            }, 500);
          });
        }
      });
    });

    const mathSection = document.getElementById('mathematiques');
    if (mathSection) {
      mathObserver.observe(mathSection);
    }