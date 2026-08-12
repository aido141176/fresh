const budgetInput = document.getElementById('budget-input');
const budgetFormatted = document.getElementById('budget-formatted');

if (budgetInput !== null && budgetFormatted !== null) {
  budgetInput.addEventListener('input', (e) => {
    const target = e.target;
    if (target instanceof HTMLInputElement) {
      const val = parseInt(target.value);
      if (val && val > 0) {
        budgetFormatted.textContent = new Intl.NumberFormat('id-ID', {
          style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
        }).format(val);
      } else {
        budgetFormatted.textContent = '';
      }
    }
  });
}

const districtGrid = document.getElementById('district-radio-grid');
const villageGrid = document.getElementById('village-radio-grid');
const checkboxGrid = document.getElementById('neighborhood-checkbox-grid');
const regencyPanel = document.getElementById('regency-panel');
const districtPanel = document.getElementById('district-panel');
const villagePanel = document.getElementById('village-panel');

let activeRegencyObj = null;
let activeDistrictObj = null;
let activeVillageObj = null;
let currentTab = '';
let currentSearchRoot = '';
let currentSearchType = '';

function showLocationPreferencesSection(visible) {
  const section = document.getElementById('location-preferences-section');
  if (!section) return;
  if (visible) {
    section.classList.remove('hidden');
  } else {
    section.classList.add('hidden');
  }
}

function clearLocationInputs() {
  document.querySelectorAll("input[name='regency'], input[name='district'], input[name='village']").forEach((input) => {
    if (input instanceof HTMLInputElement) {
      input.checked = false;
    }
  });
  activeRegencyObj = null;
  activeDistrictObj = null;
  activeVillageObj = null;
}

function clearCheckboxGrid() {
  if (!checkboxGrid) return;
  checkboxGrid.className = "p-4 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-500 italic";
  checkboxGrid.innerHTML = '<span class="text-xs text-slate-500 italic">Select a village to check off neighborhoods...</span>';
}

const neighborhoodsPanel = document.getElementById('neighborhoods-panel');



function setPreferencePanels({ regency = false, district = false, village = false, neighborhoods = false } = {}) {
  if (regencyPanel) regencyPanel.classList.toggle('hidden', !regency);
  if (districtPanel) districtPanel.classList.toggle('hidden', !district);
  if (villagePanel) villagePanel.classList.toggle('hidden', !village);
  if (neighborhoodsPanel) neighborhoodsPanel.classList.toggle('hidden', !neighborhoods);
}

function showSelectedLocationSummary(item) {
  if (!selectedSummary || !selectedTitle || !selectedBreadcrumb) return;
  selectedTitle.textContent = 'You have selected ' + item.name;
  const crumbParts = [];
  if (item.regency) crumbParts.push(item.regency);
  if (item.district) crumbParts.push(item.district);
  if (item.village) crumbParts.push(item.village);
  if (item.neighborhood) crumbParts.push(item.neighborhood);
  selectedBreadcrumb.textContent = crumbParts.join(' > ');
  selectedSummary.classList.remove('hidden');
}

function clearSelectedLocationSummary() {
  if (!selectedSummary || !selectedTitle || !selectedBreadcrumb) return;
  selectedTitle.textContent = '';
  selectedBreadcrumb.textContent = '';
  selectedSummary.classList.add('hidden');
}

function injectSelectedItem(item) {
  // clear any highlighted popular button when a search selection is made
  highlightPopularButton('');

  if (item.type !== 'neighborhood') {
    const regRadio = document.querySelector("input[name='regency'][value='" + item.regency + "']");
    if (regRadio instanceof HTMLInputElement) {
      regRadio.checked = true;
    }
  }

  if (item.type === 'regency') {
    currentSearchRoot = 'regency';
    currentSearchType = 'regency';
    renderDistricts(item.regency);
    resetNeighborhoodLabel();
    clearCheckboxGrid();
    updatePreferencePanels();
  } else if (item.type === 'district') {
    currentSearchRoot = 'district';
    currentSearchType = 'district';
    renderDistricts(item.regency, item.district);
    renderVillages(item.district);
    resetNeighborhoodLabel();
    clearCheckboxGrid();
    updatePreferencePanels();
  } else if (item.type === 'village') {
    currentSearchRoot = 'village';
    currentSearchType = 'village';
    renderDistricts(item.regency, item.district);
    renderVillages(item.district, item.village);
    const allNh = searchIndex
      .filter((it) => it.type === 'neighborhood' && it.village === item.village)
      .map((it) => it.name);
    renderNeighborhoods(item.village, allNh);
    updatePreferencePanels();
    const labelEl = document.getElementById('neighborhoods-label');
    if (labelEl) {
      labelEl.textContent = '4. Targeted Specific Neighborhoods / Banjars in ' + item.village;
    }
  } else {
    currentSearchRoot = 'neighborhood';
    currentSearchType = 'neighborhood';
    resetNeighborhoodLabel();
    clearCheckboxGrid();
    updatePreferencePanels();
  }

  showSelectedLocationSummary(item);
  // clear the input after injecting selection (keep behavior) but do it after clearing popular highlight
  geoInputEl.value = '';
  checkboxGrid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function updatePreferencePanels() {
  if (currentTab === 'popular') {
    showLocationPreferencesSection(true);
    setPreferencePanels({ neighborhoods: true });
    return;
  }

  if (currentSearchRoot === 'regency') {
    showLocationPreferencesSection(true);
    if (currentSearchType === 'district') {
      setPreferencePanels({ district: true, village: true, neighborhoods: false });
    } else if (currentSearchType === 'village') {
      setPreferencePanels({ district: true, village: true, neighborhoods: true });
    } else {
      setPreferencePanels({ district: true, village: false, neighborhoods: false });
    }
    return;
  }

  if (currentSearchRoot === 'district') {
    showLocationPreferencesSection(true);
    if (currentSearchType === 'village') {
      setPreferencePanels({ district: false, village: true, neighborhoods: true });
    } else {
      setPreferencePanels({ district: false, village: true, neighborhoods: false });
    }
    return;
  }

  if (currentSearchRoot === 'village') {
    showLocationPreferencesSection(true);
    setPreferencePanels({ district: false, village: false, neighborhoods: true });
    return;
  }

  showLocationPreferencesSection(false);
  setPreferencePanels();
}

function resetNeighborhoodLabel() {
  const labelEl = document.getElementById('neighborhoods-label');
  if (labelEl) {
    labelEl.textContent = '4. Targeted Specific Neighborhoods / Banjars (Group Checkboxes)';
  }
}

function resetSearchPanel() {
  if (geoInputEl instanceof HTMLInputElement) {
    geoInputEl.value = '';
  }
  if (resultsBox !== null) {
    resultsBox.classList.add('hidden');
    resultsBox.innerHTML = '';
  }
  if (statusIcon !== null) {
    statusIcon.classList.add('hidden');
  }
  selectedMatchItem = null;
}

function resetAllSelectionState() {
  clearLocationInputs();
  if (districtGrid !== null) {
    districtGrid.className = "grid grid-cols-2 sm:grid-cols-3 gap-2.5";
    districtGrid.innerHTML = '<span class="text-xs text-slate-500 italic">Select a Regency to see districts...</span>';
  }
  if (villageGrid !== null) {
    villageGrid.className = "grid grid-cols-2 sm:grid-cols-3 gap-2.5";
    villageGrid.innerHTML = '<span class="text-xs text-slate-500 italic">Select a District to see villages...</span>';
  }
  resetNeighborhoodLabel();
  clearCheckboxGrid();
  resetSearchPanel();
  clearSelectedLocationSummary();
  highlightPopularButton('');
  showLocationPreferencesSection(false);
  setPreferencePanels();

  const districtSelect = document.getElementById('district-select');
  if (districtSelect instanceof HTMLSelectElement) {
    districtSelect.innerHTML = '<option value="">Select a district...</option>';
    districtSelect.classList.add('hidden');
    const districtEmpty = document.getElementById('district-empty');
    if (districtEmpty instanceof HTMLElement) districtEmpty.classList.remove('hidden');
  }

  const villageSelect = document.getElementById('village-select');
  if (villageSelect instanceof HTMLSelectElement) {
    villageSelect.innerHTML = '<option value="">Select a village...</option>';
    villageSelect.classList.add('hidden');
    const villageEmpty = document.getElementById('village-empty');
    if (villageEmpty instanceof HTMLElement) villageEmpty.classList.remove('hidden');
  }

  const neighborhoodSelect = document.getElementById('neighborhood-select');
  if (neighborhoodSelect instanceof HTMLSelectElement) {
    neighborhoodSelect.innerHTML = '';
    neighborhoodSelect.classList.add('hidden');
    const nhEmpty = document.getElementById('neighborhood-empty');
    if (nhEmpty instanceof HTMLElement) nhEmpty.classList.remove('hidden');
  }

  currentSearchType = '';
  currentSearchRoot = '';
}

function renderDistricts(regencyName, autoSelectName = '') {
  if (districtGrid === null || villageGrid === null || checkboxGrid === null) return;
  
  // show a compact select for districts inside the district container
  districtGrid.innerHTML = '<select id="district-select" class="w-full h-10 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 p-2 hidden"><option value="">Select a district...</option></select><div class="text-xs text-slate-500 italic mt-1 hidden" id="district-empty">Select a Regency to see districts...</div>';
  villageGrid.innerHTML = '<span class="text-xs text-slate-500 italic">Select a District to see villages...</span>';
  clearCheckboxGrid();
  
  const locations = window.BALI_LOCATIONS;
  activeRegencyObj = locations ? locations.find((r) => r.regency_name === regencyName) : null;
  if (activeRegencyObj === null || activeRegencyObj.districts === undefined) return;

  const selectEl = districtGrid.querySelector('select');
  const emptyHint = districtGrid.querySelector('#district-empty');
  if (!(selectEl instanceof HTMLSelectElement)) return;

  // populate options
  selectEl.innerHTML = '<option value="">Select a district...</option>';
  activeRegencyObj.districts.forEach((d) => {
    const opt = document.createElement('option');
    opt.value = d.district_name;
    opt.textContent = d.district_name;
    selectEl.appendChild(opt);
  });

  if (autoSelectName) {
    selectEl.value = autoSelectName;
  }

  // show select and hide empty hint
  selectEl.classList.remove('hidden');
  if (emptyHint instanceof HTMLElement) emptyHint.classList.add('hidden');

  selectEl.addEventListener('change', () => {
    const val = selectEl.value;
    if (!val) return;
    currentSearchType = 'district';
    if (!currentSearchRoot) currentSearchRoot = 'regency';
    renderVillages(val);
    updatePreferencePanels();
  });

  updatePreferencePanels();

  updatePreferencePanels();
}

function renderVillages(districtName, autoSelectName = '') {
  if (villageGrid === null || checkboxGrid === null) return;

  // show a compact select for villages inside the village container
  villageGrid.innerHTML = '<select id="village-select" class="w-full h-10 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 p-2 hidden"><option value="">Select a village...</option></select><div class="text-xs text-slate-500 italic mt-1 hidden" id="village-empty">Select a District to see villages...</div>';
  checkboxGrid.innerHTML = '<span class="text-xs text-slate-500 italic">Select a village to check off neighborhoods...</span>';
  
  if (activeRegencyObj === null || activeRegencyObj.districts === undefined) return;
  activeDistrictObj = activeRegencyObj.districts.find((d) => d.district_name === districtName);
  if (activeDistrictObj === null || activeDistrictObj.villages === undefined) return;

  const selectEl = villageGrid.querySelector('select');
  const emptyHint = villageGrid.querySelector('#village-empty');
  if (!(selectEl instanceof HTMLSelectElement)) return;

  // populate options
  selectEl.innerHTML = '<option value="">Select a village...</option>';
  activeDistrictObj.villages.forEach((v) => {
    const opt = document.createElement('option');
    opt.value = v.village_name;
    opt.textContent = v.village_name;
    selectEl.appendChild(opt);
  });

  if (autoSelectName) {
    selectEl.value = autoSelectName;
  }

  // show select and hide empty hint
  selectEl.classList.remove('hidden');
  if (emptyHint instanceof HTMLElement) emptyHint.classList.add('hidden');

  selectEl.addEventListener('change', () => {
    const val = selectEl.value;
    if (!val) return;
    currentSearchType = 'village';
    if (!currentSearchRoot) currentSearchRoot = 'village';
    renderNeighborhoods(val);
    updatePreferencePanels();
    const labelEl = document.getElementById('neighborhoods-label');
    if (labelEl) {
      labelEl.textContent = '4. Targeted Specific Neighborhoods / Banjars in ' + val;
    }
  });

  updatePreferencePanels();
}

function renderNeighborhoods(villageName, autoCheckList = []) {
  if (checkboxGrid === null) return;
  checkboxGrid.innerHTML = '';

  if (activeDistrictObj === null || activeDistrictObj.villages === undefined) return;
  activeVillageObj = activeDistrictObj.villages.find((v) => v.village_name === villageName);
  
  if (activeVillageObj && activeVillageObj.neighborhoods && activeVillageObj.neighborhoods.length > 0) {
    checkboxGrid.className = "p-4 bg-slate-900 border border-slate-700 rounded-xl grid grid-cols-1 sm:grid-cols-6 gap-2.5 text-sm";

    activeVillageObj.neighborhoods.forEach((nh) => {
      const label = document.createElement('label');
      label.className = "flex items-center gap-2 p-2 bg-slate-800/40 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800 transition-all text-xs font-medium select-none";
      
      const checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.name = "neighborhoods";
      checkbox.value = nh;
      checkbox.className = "checkbox checkbox-success";
      
      if (autoCheckList.includes(nh)) {
        checkbox.checked = true;
      }

      const span = document.createElement('span');
      span.className = "text-slate-300";
      span.textContent = nh;

      label.appendChild(checkbox);
      label.appendChild(span);
      checkboxGrid.appendChild(label);
    });
  } else {
    checkboxGrid.className = "p-4 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-500 italic";
    checkboxGrid.textContent = "No hyper-local neighborhood sub-units registered for this specific village.";
  }

  currentSearchType = 'village';
  if (!currentSearchRoot) currentSearchRoot = 'village';
  updatePreferencePanels();
}

document.getElementsByName('regency').forEach(radio => {
  radio.addEventListener('change', (e) => {
    const target = e.target;
    if (target instanceof HTMLInputElement) {
      currentSearchRoot = 'regency';
      currentSearchType = 'regency';
      renderDistricts(target.value);
    }
  });
});

const geoInputEl = document.getElementById('geo-search-input');
const resultsBox = document.getElementById('search-results-box');
const statusIcon = document.getElementById('search-status-icon');
const selectedSummary = document.getElementById('selected-location-summary');
const selectedTitle = document.getElementById('selected-location-title');
const selectedBreadcrumb = document.getElementById('selected-location-breadcrumb');

let searchIndex = [];
let selectedMatchItem = null;

// Nationality selection helper
let nationalitiesIndex = [];
let selectedNationalityObj = null;

const locationsList = window.BALI_LOCATIONS;
if (locationsList) {
  locationsList.forEach((reg) => {
    searchIndex.push({
      type: 'regency',
      name: reg.regency_name,
      displayText: "🏙 " + reg.regency_name + " (Regency)",
      regency: reg.regency_name,
      district: null,
      village: null,
      neighborhood: null
    });
    if (reg.districts) {
      reg.districts.forEach((dist) => {
        searchIndex.push({
          type: 'district',
          name: dist.district_name,
          displayText: "🏘 " + dist.district_name + " (District in " + reg.regency_name + ")",
          regency: reg.regency_name,
          district: dist.district_name,
          village: null,
          neighborhood: null
        });
        if (dist.villages) {
          dist.villages.forEach((vil) => {
            searchIndex.push({
              type: 'village',
              name: vil.village_name,
              displayText: "🏡 " + vil.village_name + " (Village inside " + dist.district_name + ", " + reg.regency_name + ")",
              regency: reg.regency_name,
              district: dist.district_name,
              village: vil.village_name,
              neighborhood: null
            });
            if (vil.neighborhoods) {
              vil.neighborhoods.forEach((nh) => {
                searchIndex.push({
                  type: 'neighborhood',
                  name: nh,
                  displayText: "📍 " + nh + " (Neighborhood in " + vil.village_name + ", " + dist.district_name + ")",
                  regency: reg.regency_name,
                  district: dist.district_name,
                  village: vil.village_name,
                  neighborhood: nh
                });
              });
            }
          });
        }
      });
    }
  });
}

// Build nationality index from injected data and wire autocomplete
const natList = window.NATIONALITIES || [];
if (natList && Array.isArray(natList)) {
  nationalitiesIndex = natList.map((n) => ({
    code: n.code,
    country: n.country,
    nationality_term: n.nationality || n.nationality_term || ''
  }));
}

const nationalityInputEl = document.getElementById('nationality');
const nationalityResultsBox = document.getElementById('nationality-results-box');
const nationalityCodeEl = document.getElementById('nationality-code');
const nationalityCountryEl = document.getElementById('nationality-country');
const nationalityTermEl = document.getElementById('nationality-term');
const selectedNationalityDisplay = document.getElementById('selected-nationality-display');
if (nationalityInputEl instanceof HTMLInputElement && nationalityResultsBox !== null) {
  nationalityInputEl.addEventListener('input', (e) => {
    const q = nationalityInputEl.value.trim().toUpperCase();
    nationalityResultsBox.innerHTML = '';
    // clear previous selection if user edits
    selectedNationalityObj = null;
    if (nationalityCodeEl instanceof HTMLInputElement) nationalityCodeEl.value = '';
    if (nationalityCountryEl instanceof HTMLInputElement) nationalityCountryEl.value = '';
    if (nationalityTermEl instanceof HTMLInputElement) nationalityTermEl.value = '';
    if (selectedNationalityDisplay instanceof HTMLElement) selectedNationalityDisplay.classList.add('hidden');

    if (q.length < 2) {
      nationalityResultsBox.classList.add('hidden');
      return;
    }
    // Search by country name (user types country) and show country in results
    const matches = nationalitiesIndex.filter((it) => (it.country || '').toUpperCase().includes(q)).slice(0, 10);
    if (matches.length === 0) {
      nationalityResultsBox.classList.add('hidden');
      return;
    }
    nationalityResultsBox.classList.remove('hidden');
    matches.forEach((it) => {
      const row = document.createElement('div');
      row.className = 'p-2 hover:bg-slate-700/60 cursor-pointer text-xs text-slate-200';
      // Show the Country in the dropdown as requested
      row.textContent = it.country || it.nationality_term || '';
      row.addEventListener('click', () => {
        selectedNationalityObj = it;
        // set the visible input to the country
        nationalityInputEl.value = it.country || it.nationality_term || '';
        // populate hidden fields for backend (store nationality term in hidden field)
        if (nationalityCodeEl instanceof HTMLInputElement) nationalityCodeEl.value = it.code || '';
        if (nationalityCountryEl instanceof HTMLInputElement) nationalityCountryEl.value = it.country || '';
        if (nationalityTermEl instanceof HTMLInputElement) nationalityTermEl.value = it.nationality_term || '';
        // show selected display (display country)
        if (selectedNationalityDisplay instanceof HTMLElement) {
          selectedNationalityDisplay.textContent = 'Selected: ' + (it.country || it.nationality_term || '');
          selectedNationalityDisplay.classList.remove('hidden');
        }
        nationalityResultsBox.classList.add('hidden');
      });
      nationalityResultsBox.appendChild(row);
    });
  });

  document.addEventListener('click', (ev) => {
    const target = ev.target;
    if (target instanceof Element && (target === nationalityInputEl || nationalityResultsBox.contains(target))) return;
    if (nationalityResultsBox) nationalityResultsBox.classList.add('hidden');
  });
}

if (geoInputEl instanceof HTMLInputElement && resultsBox !== null) {
  geoInputEl.addEventListener('input', (e) => {
    const target = e.target;
    if (target instanceof HTMLInputElement) {
      const query = target.value.trim().toUpperCase();
      resultsBox.innerHTML = '';
      if (statusIcon !== null) statusIcon.classList.add('hidden');

      if (query.length < 2) {
        resultsBox.classList.add('hidden');
        return;
      }

      const matches = searchIndex.filter(item => item.name.toUpperCase().includes(query)).slice(0, 5);

      if (matches.length > 0) {
        resultsBox.classList.remove('hidden');
        matches.forEach(item => {
          const row = document.createElement('div');
          row.className = "p-3 hover:bg-slate-700/60 cursor-pointer text-xs text-slate-200 font-medium transition-all";
          row.textContent = item.displayText;
          row.addEventListener('click', () => {
            selectedMatchItem = item;
            geoInputEl.value = item.name;
            resultsBox.classList.add('hidden');
            if (statusIcon !== null) statusIcon.classList.remove('hidden');
            injectSelectedItem(item);
          });
          resultsBox.appendChild(row);
        });
      } else {
        resultsBox.classList.add('hidden');
      }
    }
  });
}

const popularVillageNameMap = {
  'kerobakan': 'KEROBOKAN',
  'uluwatu/ pecatu': 'PECATU',
  'uluwatu / pecatu': 'PECATU',
  'jimbarin': 'JIMBARAN'
};

function findVillageItem(villageName) {
  if (!villageName) return null;
  const normalized = villageName.trim().toLowerCase();
  const exact = searchIndex.find((item) => item.type === 'village' && item.name.toLowerCase() === normalized);
  if (exact) return exact;

  const mapped = popularVillageNameMap[normalized];
  if (mapped) {
    const mappedExact = searchIndex.find((item) => item.type === 'village' && item.name.toLowerCase() === mapped.toLowerCase());
    if (mappedExact) return mappedExact;
  }

  const slashParts = normalized.split('/').map((part) => part.trim()).filter(Boolean);
  if (slashParts.length > 1) {
    const match = searchIndex.find((item) => item.type === 'village' && slashParts.every((part) => item.name.toLowerCase().includes(part)));
    if (match) return match;
  }

  return searchIndex.find((item) => item.type === 'village' && item.name.toLowerCase().includes(normalized))
    || searchIndex.find((item) => item.type === 'village' && normalized.includes(item.name.toLowerCase()));
}

function selectVillageByName(villageName) {
  const mappedVillageName = popularVillageNameMap[villageName.toLowerCase()] || villageName;
  const item = findVillageItem(mappedVillageName);
  if (!item) return;

  const regRadio = document.querySelector("input[name='regency'][value='" + item.regency + "']");
  if (regRadio instanceof HTMLInputElement) {
    regRadio.checked = true;
  }

  renderDistricts(item.regency, item.district);
  renderVillages(item.district, item.village);

  const allNh = searchIndex
    .filter((it) => it.type === 'neighborhood' && it.village === item.village)
    .map((it) => it.name);
  renderNeighborhoods(item.village, allNh);

  currentSearchRoot = 'village';
  currentSearchType = 'village';
  updatePreferencePanels();

  const labelEl = document.getElementById('neighborhoods-label');
  if (labelEl) {
    labelEl.textContent = '4. Targeted Specific Neighborhoods / Banjars in ' + item.village;
  }

  showLocationPreferencesSection(true);
  // Show the selected location summary (same as when selecting from search)
  showSelectedLocationSummary(item);
  // keep a reference as if it were selected from geo-search
  selectedMatchItem = item;
  highlightPopularButton(item.village);
  checkboxGrid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function highlightPopularButton(villageName = '') {
  const normalized = villageName.trim().toUpperCase();
  document.querySelectorAll('[data-popular-village]').forEach((button) => {
    if (!(button instanceof HTMLElement)) return;
    const isSelected = normalized !== '' && button.dataset.popularVillage?.toUpperCase() === normalized;
    button.classList.toggle('bg-indigo-600', isSelected);
    button.classList.toggle('border-indigo-500', isSelected);
    button.classList.toggle('text-white', isSelected);
    button.classList.toggle('bg-slate-900/80', !isSelected);
    button.classList.toggle('border-slate-700', !isSelected);
    button.classList.toggle('text-slate-200', !isSelected);
    button.classList.toggle('hover:bg-slate-800', !isSelected);
  });
}

function setTabState(activeTab) {
  if (activeTab !== currentTab) {
    resetAllSelectionState();
  }
  const tabPopularBtn = document.getElementById('tab-btn-popular');
  const tabAllBtn = document.getElementById('tab-btn-all');
  const popularPanel = document.getElementById('tab-panel-popular');
  const allPanel = document.getElementById('tab-panel-all');
  const allSelectorsPanel = document.getElementById('all-bali-selectors-panel');

  if (activeTab === 'popular') {
    popularPanel?.classList.remove('hidden');
    allPanel?.classList.add('hidden');
    allSelectorsPanel?.classList.add('hidden');
    tabPopularBtn?.classList.add('border-indigo-500');
    tabPopularBtn?.classList.remove('border-transparent');
    tabPopularBtn?.classList.add('text-white');
    tabAllBtn?.classList.remove('border-indigo-500');
    tabAllBtn?.classList.add('border-transparent');
    tabAllBtn?.classList.remove('text-white');
  } else {
    popularPanel?.classList.add('hidden');
    allPanel?.classList.remove('hidden');
    allSelectorsPanel?.classList.remove('hidden');
    tabAllBtn?.classList.add('border-indigo-500');
    tabAllBtn?.classList.remove('border-transparent');
    tabAllBtn?.classList.add('text-white');
    tabPopularBtn?.classList.remove('border-indigo-500');
    tabPopularBtn?.classList.add('border-transparent');
    tabPopularBtn?.classList.remove('text-white');
  }
  currentTab = activeTab;
}

const popularButtons = document.querySelectorAll('[data-popular-village]');
popularButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    const villageName = target.dataset.popularVillage;
    if (villageName) {
      // clear geo search input and results when a popular button is clicked
      if (geoInputEl instanceof HTMLInputElement) geoInputEl.value = '';
      if (resultsBox !== null) { resultsBox.classList.add('hidden'); resultsBox.innerHTML = ''; }
      selectedMatchItem = null;
      // select the village and render children
      selectVillageByName(villageName);
    }
  });
});

// Remove tab controls — layout now shows popular buttons and search side-by-side
// (previous tab buttons removed from the DOM)


const fileInput = document.getElementById('profile-image-file');
const avatarPreview = document.getElementById('avatar-preview');
const mediaIdInput = document.getElementById('wp-media-id');
const formAlert = document.getElementById('form-alert');
const token = localStorage.getItem('wp_session_token');
const nameData = localStorage.getItem('wp_user_name');

if (fileInput !== null) {
  fileInput.addEventListener('change', async (e) => {
    const inputEl = e.target;
    if (inputEl instanceof HTMLInputElement) {
      const file = inputEl.files ? inputEl.files[0] : null;
      if (file === null || avatarPreview === null || !(mediaIdInput instanceof HTMLInputElement) || formAlert === null) return;

      formAlert.className = "mb-6 p-4 rounded-xl text-sm font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-400";
      formAlert.textContent = "Uploading profile photo safely to WordPress backend pipeline...";
      formAlert.classList.remove('hidden');

      try {
        const mediaRes = await fetch('https://api.amcd.com.au/wp-json/wp/v2/media', {
          method: 'POST',
          headers: { 
            'Authorization': "Bearer " + token,
            'Content-Type': file.type,
            'Content-Disposition': 'attachment; filename="' + file.name + '"'
          },
          body: file
        });
        
        const mediaData = await mediaRes.json();

        if (mediaRes.ok && mediaData.id) {
          mediaIdInput.value = mediaData.id;
          avatarPreview.innerHTML = "<img src='" + mediaData.source_url + "' class='w-full h-full object-cover' />";
          formAlert.className = "mb-6 p-4 rounded-xl text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400";
          formAlert.textContent = "✓ Profile image compiled and uploaded successfully.";
        } else {
          formAlert.className = "mb-6 p-4 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400";
          formAlert.textContent = "Media conversion dropped: " + (mediaData.message || "Verification fault");
        }
      } catch (err) {
        formAlert.className = "mb-6 p-4 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400";
        formAlert.textContent = "Failed connecting to media endpoints.";
      }
    }
  });
}

    
    const seekerForm = document.getElementById('seeker-form');
    const submitBtn = document.getElementById('submit-btn');
    if (seekerForm !== null) {
      seekerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (formAlert === null || !(submitBtn instanceof HTMLButtonElement) || !(budgetInput instanceof HTMLInputElement)) return;
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving Profile...";

        // Gather selected neighborhoods from multi-select if available
        const selectedNHs = [];
        const neighborhoodSelectEl = document.getElementById('neighborhood-select');
        if (neighborhoodSelectEl instanceof HTMLSelectElement) {
          Array.from(neighborhoodSelectEl.selectedOptions).forEach((opt) => selectedNHs.push(opt.value));
        } else {
          const checkedBoxes = document.querySelectorAll('input[name="neighborhoods"]:checked');
          checkedBoxes.forEach((cb) => { if (cb instanceof HTMLInputElement) selectedNHs.push(cb.value); });
        }

        const publishEl = document.getElementById('publish-profile');
        const isPublished = publishEl instanceof HTMLInputElement ? publishEl.checked : false;
        const mediaId = mediaIdInput instanceof HTMLInputElement ? parseInt(mediaIdInput.value) || '' : '';
        const budgetValue = parseInt(budgetInput.value) || 0;

        // Regency (still radio)
        let selectedRegency = '';
        const regRadioChecked = document.querySelector('input[name="regency"]:checked');
        if (regRadioChecked instanceof HTMLInputElement) selectedRegency = regRadioChecked.value;

        // District (select preferred)
        let selectedDistrict = '';
        const districtSelectEl = document.getElementById('district-select');
        if (districtSelectEl instanceof HTMLSelectElement) {
          selectedDistrict = districtSelectEl.value || '';
        } else {
          const distRadioChecked = document.querySelector('input[name="district"]:checked');
          if (distRadioChecked instanceof HTMLInputElement) selectedDistrict = distRadioChecked.value;
        }

        // Village (prefer select, fallback to radio)
        let selectedVillage = '';
        const villageSelectEl = document.getElementById('village-select');
        if (villageSelectEl instanceof HTMLSelectElement) {
          selectedVillage = villageSelectEl.value || '';
        } else {
          const vilRadioChecked = document.querySelector('input[name="village"]:checked');
          if (vilRadioChecked instanceof HTMLInputElement) selectedVillage = vilRadioChecked.value;
        }

        // Additional new fields
        const moveInEl = document.getElementById('move-in-date');
        const moveInDate = moveInEl instanceof HTMLInputElement ? moveInEl.value : '';
        const aboutEl = document.getElementById('about-me');
        const aboutMe = aboutEl instanceof HTMLTextAreaElement ? aboutEl.value : '';
        const occEl = document.getElementById('occupation');
        const occupation = occEl instanceof HTMLInputElement ? occEl.value : '';
        const natEl = document.getElementById('nationality');
        let nationality = { code: '', country: '', nationality_term: '' };
        if (selectedNationalityObj) {
          nationality = selectedNationalityObj;
        } else if (natEl instanceof HTMLInputElement) {
          const typed = natEl.value.trim();
          // Try exact or partial matches against both country and nationality_term
          const found = nationalitiesIndex.find((n) => (n.country || '').toLowerCase() === typed.toLowerCase())
            || nationalitiesIndex.find((n) => (n.nationality_term || '').toLowerCase() === typed.toLowerCase())
            || nationalitiesIndex.find((n) => (n.country || '').toLowerCase().includes(typed.toLowerCase()))
            || nationalitiesIndex.find((n) => (n.nationality_term || '').toLowerCase().includes(typed.toLowerCase()));
          if (found) nationality = found;
        }

        // Enforce nationality selection: must resolve to a known nationality
        if (!nationality || !nationality.code) {
          formAlert.className = "mb-6 p-4 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400";
          formAlert.textContent = "Please select a Nationality from the list (start typing and choose an option).";
          submitBtn.disabled = false;
          submitBtn.textContent = "Save Profile Settings";
          return;
        }
        const stayEl = document.getElementById('stay-term');
        const stayTerm = stayEl instanceof HTMLSelectElement ? stayEl.value : '';

        // Pull logged-in parameters from localStorage to fulfill the REST API's strict safety checks
        const storedEmail = localStorage.getItem('wp_user_email') || '';
        const storedName = localStorage.getItem('wp_user_name') || '';
        const storedUserId = localStorage.getItem('wp_user_id') || '1';

        // Gather only your custom flatmate targeting parameters
        const updatePayload = {
          acf: {
            publish_profile_to_seekers: isPublished,
            profile_image: mediaId,
            move_in_date: moveInDate,
            about_me: aboutMe,
            occupation: occupation,
            nationality: nationality,
            stay_term: stayTerm,
            target_budget: budgetValue,
            preferences: {
              preferred_regency: selectedRegency,
              preferred_district: selectedDistrict,
              preferred_village: selectedVillage,
              preferred_neighborhoods: selectedNHs
            }
          }
        };

        try {
          // ✅ DYNAMIC PATH MATRIX: Targets your exact user entry row link directly
          const targetUserUrl = 'https://api.amcd.com.au/wp-json/wp/v2/users/' + storedUserId;
          console.log("Pushing payload parameters cleanly to target path row: " + targetUserUrl);

          const saveRes = await fetch(targetUserUrl, {
            method: 'POST', // WordPress treats POST requests to a specific User ID as an UPDATE action
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "Bearer " + token
            },
            body: JSON.stringify(updatePayload)
          });

          const saveResult = await saveRes.json();

          if (saveRes.ok) {
            formAlert.className = "mb-6 p-4 rounded-xl text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400";
            formAlert.textContent = "✓ Seeker profile specifications locked and saved successfully.";
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            formAlert.className = "mb-6 p-4 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400";
            formAlert.textContent = "Update rejected: " + (saveResult.message || "Validation error");
          }
        } catch (err) {
          formAlert.className = "mb-6 p-4 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400";
          formAlert.textContent = "Server synchronization dropped. Connection timed out.";
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = "Save Profile Settings";
        }
      });
    }

// Load existing user data from WordPress and populate the form for editing
async function loadExistingUserData() {
  console.debug('[Seeker] loadExistingUserData: start');
  let storedUserId = localStorage.getItem('wp_user_id');
  const token = localStorage.getItem('wp_session_token');
  if (!token) {
    console.debug('[Seeker] loadExistingUserData: no token in localStorage');
    return;
  }

  // If user id not stored, try fallback /users/me
  if (!storedUserId) {
    console.debug('[Seeker] loadExistingUserData: wp_user_id not found, attempting /users/me');
    try {
      const meRes = await fetch('https://api.amcd.com.au/wp-json/wp/v2/users/me', { headers: { 'Authorization': 'Bearer ' + token } });
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData && meData.id) {
          storedUserId = String(meData.id);
          console.debug('[Seeker] loadExistingUserData: found user id from /me =', storedUserId);
          localStorage.setItem('wp_user_id', storedUserId);
        }
      }
    } catch (err) {
      console.warn('[Seeker] loadExistingUserData: /users/me lookup failed', err);
    }
  }

  if (!storedUserId) {
    console.debug('[Seeker] loadExistingUserData: no user id available after fallback');
    return;
  }

  try {
    console.debug('[Seeker] loadExistingUserData: fetching user', storedUserId);
    const userRes = await fetch('https://api.amcd.com.au/wp-json/wp/v2/users/' + storedUserId, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!userRes.ok) {
      console.warn('[Seeker] loadExistingUserData: user fetch not ok', userRes.status);
      return;
    }
    const userData = await userRes.json();
    const acf = (userData && userData.acf) ? userData.acf : {};

    console.debug('[Seeker] loadExistingUserData: got acf', acf);

    // Publish checkbox
    const publishEl = document.getElementById('publish-profile');
    if (publishEl instanceof HTMLInputElement && typeof acf.publish_profile_to_seekers !== 'undefined') {
      publishEl.checked = Boolean(acf.publish_profile_to_seekers);
    }

    // Profile image
    const mediaIdInput = document.getElementById('wp-media-id');
    if (mediaIdInput instanceof HTMLInputElement && acf.profile_image) {
      mediaIdInput.value = acf.profile_image;
      // try to fetch media url if numeric id
      if (typeof acf.profile_image === 'number' || /^[0-9]+$/.test(String(acf.profile_image))) {
        try {
          const mediaRes = await fetch('https://api.amcd.com.au/wp-json/wp/v2/media/' + acf.profile_image, { headers: { 'Authorization': 'Bearer ' + token } });
          if (mediaRes.ok) {
            const media = await mediaRes.json();
            const avatarPreview = document.getElementById('avatar-preview');
            if (avatarPreview instanceof HTMLElement && media && media.source_url) {
              avatarPreview.innerHTML = "<img src='" + media.source_url + "' class='w-full h-full object-cover' />";
            }
          }
        } catch (err) { console.warn('[Seeker] loadExistingUserData: failed to fetch media', err); }
      }
    }

    // Move-in date, about, occupation, stay term
    if (acf.move_in_date) {
      const moveEl = document.getElementById('move-in-date');
      if (moveEl instanceof HTMLInputElement) moveEl.value = acf.move_in_date;
    }
    if (acf.about_me) {
      const aboutEl = document.getElementById('about-me');
      if (aboutEl instanceof HTMLTextAreaElement) aboutEl.value = acf.about_me;
    }
    if (acf.occupation) {
      const occEl = document.getElementById('occupation');
      if (occEl instanceof HTMLInputElement) occEl.value = acf.occupation;
    }
    if (acf.stay_term) {
      const stayEl = document.getElementById('stay-term');
      if (stayEl instanceof HTMLSelectElement) stayEl.value = acf.stay_term;
    }

    // Budget
    if (typeof acf.target_budget !== 'undefined') {
      const budgetEl = document.getElementById('budget-input');
      const budgetFormatted = document.getElementById('budget-formatted');
      if (budgetEl instanceof HTMLInputElement) {
        budgetEl.value = String(acf.target_budget || '');
        if (budgetFormatted instanceof HTMLElement && acf.target_budget) {
          budgetFormatted.textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(acf.target_budget);
        }
      }
    }

    // Nationality (object expected)
    if (acf.nationality) {
      const nat = acf.nationality;
      selectedNationalityObj = nat;
      const natInput = document.getElementById('nationality');
      const natCode = document.getElementById('nationality-code');
      const natCountry = document.getElementById('nationality-country');
      const natTerm = document.getElementById('nationality-term');
      const selectedDisplay = document.getElementById('selected-nationality-display');
      if (natInput instanceof HTMLInputElement) natInput.value = nat.country || nat.nationality_term || '';
      if (natCode instanceof HTMLInputElement) natCode.value = nat.code || '';
      if (natCountry instanceof HTMLInputElement) natCountry.value = nat.country || '';
      if (natTerm instanceof HTMLInputElement) natTerm.value = nat.nationality_term || '';
      if (selectedDisplay instanceof HTMLElement) {
        selectedDisplay.textContent = 'Selected: ' + (nat.country || nat.nationality_term || '');
        selectedDisplay.classList.remove('hidden');
      }
    }

    // Preferences: render hierarchy and set selections
    const prefs = (acf.preferences) ? acf.preferences : {};
    if (prefs.preferred_regency) {
      // select regency radio
      const regRadio = document.querySelector("input[name='regency'][value='" + prefs.preferred_regency + "']");
      if (regRadio instanceof HTMLInputElement) {
        regRadio.checked = true;
        // render districts
        renderDistricts(prefs.preferred_regency, prefs.preferred_district || '');
      }
    }
    if (prefs.preferred_district) {
      // ensure district select exists and set
      const districtSelect = document.getElementById('district-select');
      if (districtSelect instanceof HTMLSelectElement) {
        // if not populated, try to render using regency mapping
        if (districtSelect.options.length <= 1 && prefs.preferred_regency) renderDistricts(prefs.preferred_regency, prefs.preferred_district || '');
        districtSelect.value = prefs.preferred_district || '';
        // render villages
        if (prefs.preferred_district) renderVillages(prefs.preferred_district, prefs.preferred_village || '');
      }
    }
    if (prefs.preferred_village) {
      const villageSelect = document.getElementById('village-select');
      if (villageSelect instanceof HTMLSelectElement) {
        if (villageSelect.options.length <= 1 && prefs.preferred_district) renderVillages(prefs.preferred_district, prefs.preferred_village || '');
        villageSelect.value = prefs.preferred_village || '';
        // render neighborhoods and check the ones in preferred_neighborhoods
        if (prefs.preferred_village) {
          const allNh = searchIndex.filter((it) => it.type === 'neighborhood' && it.village === prefs.preferred_village).map((it) => it.name);
          renderNeighborhoods(prefs.preferred_village, allNh);
          // check preferred neighborhoods
          if (Array.isArray(prefs.preferred_neighborhoods) && prefs.preferred_neighborhoods.length > 0) {
            prefs.preferred_neighborhoods.forEach((nh) => {
              const cb = document.querySelector('input[name="neighborhoods"][value="' + nh + '"]');
              if (cb instanceof HTMLInputElement) cb.checked = true;
            });
          }
          // update neighborhoods label
          const labelEl = document.getElementById('neighborhoods-label');
          if (labelEl) labelEl.textContent = '4. Targeted Specific Neighborhoods / Banjars in ' + prefs.preferred_village;
        }
      }
    }

    // If a village is present, show the selected summary breadcrumb
    if (prefs.preferred_village) {
      const item = {
        name: prefs.preferred_village,
        regency: prefs.preferred_regency || '',
        district: prefs.preferred_district || '',
        village: prefs.preferred_village || ''
      };
      showSelectedLocationSummary(item);
      selectedMatchItem = item;
      highlightPopularButton(prefs.preferred_village);
      showLocationPreferencesSection(true);
    }

  } catch (err) {
    console.error('Failed to load existing user data', err);
  }
}

// invoke loader to populate form for editing
loadExistingUserData();
