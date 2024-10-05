const mainContent = document.getElementById('main-content');
const links = document.querySelectorAll('nav a, header a');
const link_rodape = document.querySelector('.link-rodape');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('nav');

function loadPage(page) {
    mainContent.innerHTML = '';
    
    const menus = document.querySelectorAll('.main-menu');
            
    menus.forEach(menu => {
        menu.classList.remove('ativo');

        if (menu.nextElementSibling && menu !== menu.nextElementSibling) {
            menu.nextElementSibling.style.display = 'none';
        }
    });

    fetch(page)
        .then(response => response.text())
        .then(html => {
            mainContent.innerHTML = html;
        })
        .catch(error => {
            console.error('Error load content:', error);
        });

    nav.classList.remove('ativo');
}

links.forEach(link => {
    link.addEventListener('click', function(event) {            
        const menus = document.querySelectorAll('.main-menu');
        
        menus.forEach(menu => {
            if (menu !== this) {
                menu.classList.remove('ativo');
            }

            if (menu.nextElementSibling && menu !== menu.nextElementSibling) {
                menu.nextElementSibling.style.display = 'none';
            }
        });

        if (this.nextElementSibling && this.classList.contains('main-menu')) {
            event.preventDefault(); 

            if (this.classList.contains('active')) {
                this.classList.remove('active');
                this.nextElementSibling.style.display = 'none';
            } else {
                this.classList.add('active');
                this.nextElementSibling.style.display = 'block';
            }

            return;
        }

        event.preventDefault();

        const href = this.getAttribute('href');

        loadPage(href);
    });
});

link_rodape.addEventListener('click', function(event) {
    event.preventDefault();

    const href = this.getAttribute('href');

    loadPage(href);
});

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

loadPage('view/game.html');