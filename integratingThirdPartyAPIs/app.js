// Harvard Art Museums Explorer
// API base: https://api.harvardartmuseums.org

const API_BASE = 'https://api.harvardartmuseums.org';
const API_KEY = 'b8d41dfa-4e7e-4379-b9ab-a6f60ab57bbd';

let currentPage = 1;
let currentQuery = '';
let isLoading = false;
let hasMoreResults = true;
let totalResults = 0;

const $ = id => document.getElementById(id);

function showError(msg){
  $('errorContainer').innerHTML = `<div class="error">${msg}</div>`;
  setTimeout(()=>{$('errorContainer').innerHTML = ''},5000);
}

function showLoadingIndicator(){
  const existing = document.getElementById('loadingIndicator');
  if(!existing){
    const div = document.createElement('div');
    div.id = 'loadingIndicator';
    div.className = 'loading';
    div.textContent = 'Loading...';
    $('results').appendChild(div);
  }
}

function removeLoadingIndicator(){
  const el = document.getElementById('loadingIndicator');
  if(el) el.remove();
}

async function fetchArtworks(page=1, q=''){
  const size = 50; // Fetch more per request to account for filtering
  let url = `${API_BASE}/object?apikey=${API_KEY}&size=${size}&page=${page}`;
  if(q) url += `&keyword=${encodeURIComponent(q)}`;

  try{
    const res = await fetch(url);
    if(!res.ok){
      if(res.status===401) throw new Error('Invalid API key (401 Unauthorized)');
      if(res.status===404) throw new Error('No results found (404)');
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return data;
  }catch(err){
    if(err instanceof TypeError) throw new Error('Network error: check your connection');
    throw err;
  }
}

function renderArtworks(records, append=false){
  const container = $('results');
  if(!records || records.length===0){
    if(!append) container.innerHTML = '<div class="no-results">No artworks with images found.</div>';
    return 0;
  }

  const withImages = records.filter(r => r.primaryimageurl);
  if(withImages.length===0 && !append){
    container.innerHTML = '<div class="no-results">No artworks with images found.</div>';
    return 0;
  }

  const html = withImages.map(r=>{
    const artist = r.people?.[0]?.name || 'Unknown artist';
    const title = r.title || 'Untitled';
    const date = r.dated || '';
    return `
      <div class="card" onclick="showArtwork(${r.objectid})">
        <img src="${r.primaryimageurl}" alt="${title}">
        <div class="meta">
          <h4>${title}</h4>
          <p>${artist}</p>
          <p class="small">${date}</p>
        </div>
      </div>`;
  }).join('');

  if(append){
    container.innerHTML += html;
  } else {
    container.innerHTML = html;
  }

  return withImages.length;
}

async function loadMore(){
  if(isLoading || !hasMoreResults) return;
  
  try{
    isLoading = true;
    showLoadingIndicator();
    
    const data = await fetchArtworks(currentPage + 1, currentQuery);
    const count = renderArtworks(data.records, true);
    
    if(count === 0 || !data.info.next){
      hasMoreResults = false;
    }
    
    currentPage = data.info.page;
    totalResults = data.info.totalrecords;
    $('pageInfo').textContent = `Showing results (Total: ${totalResults})`;
    
  }catch(err){
    showError(err.message);
  } finally {
    isLoading = false;
    removeLoadingIndicator();
  }
}

async function search(query){
  try{
    if(isLoading) return;
    isLoading = true;
    
    currentQuery = query.trim();
    if(!currentQuery) { showError('Please enter a search term'); return; }
    
    currentPage = 1;
    hasMoreResults = true;
    $('results').innerHTML = '<div class="loading">Loading...</div>';
    $('pageInfo').textContent = '';
    
    // Fetch multiple pages in parallel for initial load
    const promises = [
      fetchArtworks(1, currentQuery),
      fetchArtworks(2, currentQuery),
      fetchArtworks(3, currentQuery),
    ];
    
    const [data1, data2, data3] = await Promise.all(promises);
    
    renderArtworks(data1.records, false);
    renderArtworks(data2.records, true);
    renderArtworks(data3.records, true);
    
    currentPage = 3;
    totalResults = data1.info?.totalrecords || 0;
    $('pageInfo').textContent = `Showing results (Total: ${totalResults})`;
    
    if(!data3.info?.next) {
      hasMoreResults = false;
    }
    
    setupInfiniteScroll();
    
  }catch(err){
    $('results').innerHTML = '';
    showError(err.message);
  } finally {
    isLoading = false;
  }
}

async function randomArtwork(){
  try{
    if(isLoading) return;
    isLoading = true;
    
    $('results').innerHTML = '<div class="loading">Loading...</div>';
    $('pageInfo').textContent = '';
    
    const randomPage = Math.max(1, Math.floor(Math.random()*100)+1);
    const data = await fetchArtworks(randomPage, '');
    if(data.records && data.records.length>0){
      renderArtworks(data.records, false);
      $('pageInfo').textContent = 'Random artwork';
      hasMoreResults = false;
    }else{
      showError('No artwork returned from random page');
      $('results').innerHTML = '';
    }
  }catch(err){
    $('results').innerHTML = '';
    showError(err.message);
  } finally {
    isLoading = false;
  }
}

async function showArtwork(id){
  try{
    const url = `${API_BASE}/object/${id}?apikey=${API_KEY}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const r = data.records?.[0] || data;
    if(!r.objectid) throw new Error('Artwork not found');
    const img = r.primaryimageurl || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22600%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22800%22 height=%22600%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo Image Available%3C/text%3E%3C/svg%3E';
    const artist = r.people?.[0]?.name || 'Unknown';
    $('modalContent').innerHTML = `
      <img src="${img}" alt="${r.title || 'Artwork'}">
      <h2>${r.title || 'Untitled'}</h2>
      <p class="small"><strong>Artist:</strong> ${artist}</p>
      <p class="small"><strong>Date:</strong> ${r.dated || 'Unknown'}</p>
      <p class="small"><strong>Medium:</strong> ${r.medium || 'Unknown'}</p>
      <p class="small"><strong>Classification:</strong> ${r.classification || 'Unknown'}</p>
      <p class="small"><strong>Credit line:</strong> ${r.creditline || 'Unknown'}</p>
      <p style="margin-top:8px">${r.description || ''}</p>
    `;
    $('modal').classList.add('active');
  }catch(err){
    showError(err.message);
  }
}

function setupInfiniteScroll(){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting && hasMoreResults && !isLoading){
        loadMore();
      }
    });
  }, { threshold: 0.1 });

  const sentinel = document.getElementById('scrollSentinel');
  if(sentinel) observer.observe(sentinel);
}

// Wire up UI
document.addEventListener('DOMContentLoaded', ()=>{
  $('search').addEventListener('click', ()=> search($('q').value));
  $('q').addEventListener('keypress', (e)=>{ if(e.key==='Enter') search($('q').value); });
  $('random').addEventListener('click', randomArtwork);
  $('closeModal').addEventListener('click', ()=>$('modal').classList.remove('active'));
  $('modal').addEventListener('click', e=>{ if(e.target.id==='modal') $('modal').classList.remove('active'); });

  setupInfiniteScroll();
});
