/* Simple client-side search + filter + sort + load more (for static/demo) */
( () => {
    const list = document.querySelectorAll( '.notice-card:not(.notice-card--pinned)' );
    const search = document.getElementById( 'noticeSearch' );
    const cat = document.getElementById( 'noticeCategory' );
    const sort = document.getElementById( 'noticeSort' );
    const noticeList = document.getElementById( 'noticeList' );
    const loadMoreBtn = document.getElementById( 'loadMore' );

    let showing = 6; // initial cards to show
    const allCards = Array.from( list );

    function formatDate ( str ) {
        return new Date( str );
    }

    function render () {
        const q = ( search.value || '' ).toLowerCase();
        const c = cat.value;
        const s = sort.value;

        // filter
        let filtered = allCards.filter( card => {
            const title = card.querySelector( 'h3' ).textContent.toLowerCase();
            const excerpt = ( card.querySelector( '.excerpt' ) || {} ).textContent || '';
            const category = card.dataset.category || '';
            if ( c && category !== c ) return false;
            if ( q && !( title.includes( q ) || excerpt.toLowerCase().includes( q ) ) ) return false;
            return true;
        } );

        // sort
        filtered.sort( ( a, b ) => {
            const da = formatDate( a.dataset.date );
            const db = formatDate( b.dataset.date );
            return s === 'date-asc' ? da - db : db - da;
        } );

        // render limited
        noticeList.innerHTML = '';
        filtered.slice( 0, showing ).forEach( n => noticeList.appendChild( n ) );
        // show/hide load more
        loadMoreBtn.style.display = filtered.length > showing ? 'inline-block' : 'none';
    }

    // events
    search.addEventListener( 'input', () => { showing = 6; render(); } );
    cat.addEventListener( 'change', () => { showing = 6; render(); } );
    sort.addEventListener( 'change', () => { showing = 6; render(); } );
    loadMoreBtn.addEventListener( 'click', () => { showing += 6; render(); } );

    // initial
    render();
} )();