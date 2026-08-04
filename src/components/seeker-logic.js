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

let activeRegencyObj = null;
let activeDistrictObj = null;
let activeVillageObj = null;

function renderDistricts(regencyName, autoSelectName = '') {
  if (districtGrid === null || villageGrid === null || checkboxGrid === null) return;
  
  districtGrid.innerHTML = '';
  villageGrid.innerHTML = '<span class="text-xs text-slate-500 italic">Select a District to see villages...</span>';
  checkboxGrid.innerHTML = '<span class="text-xs text-slate-500 italic">Select a village to check off neighborhoods...</span>';
  
  const locations = window.BALI_LOCATIONS;
  activeRegencyObj = locations ? locations.find((r) => r.regency_name === regencyName) : null;
  if (activeRegencyObj === null || activeRegencyObj.districts === undefined) return;

  districtGrid.className = "grid grid-cols-2 sm:grid-cols-3 gap-2.5";
  activeRegencyObj.districts.forEach((d) => {
    const label = document.createElement('label');
    label.className = "flex items-center gap-2 p-2 bg-slate-900/60 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-900 transition-all text-xs text-slate-200 select-none";
    
    const radio = document.createElement('input');
    radio.type = "radio";
    radio.name = "district";
    radio.value = d.district_name;
    radio.className = "w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500";
    
    if (d.district_name === autoSelectName) {
      radio.checked = true;
    }

    radio.addEventListener('change', () => {
      renderVillages(d.district_name);
    });

    const span = document.createElement('span');
    span.textContent = d.district_name;

    label.appendChild(radio);
    label.appendChild(span);
    districtGrid.appendChild(label);
  });
}

function renderVillages(districtName, autoSelectName = '') {
  if (villageGrid === null || checkboxGrid === null) return;

  villageGrid.innerHTML = '';
  checkboxGrid.innerHTML = '<span class="text-xs text-slate-500 italic">Select a village to check off neighborhoods...</span>';
  
  if (activeRegencyObj === null || activeRegencyObj.districts === undefined) return;
  activeDistrictObj = activeRegencyObj.districts.find((d) => d.district_name === districtName);
  if (activeDistrictObj === null || activeDistrictObj.villages === undefined) return;

  villageGrid.className = "grid grid-cols-2 sm:grid-cols-3 gap-2.5";
  activeDistrictObj.villages.forEach((v) => {
    const label = document.createElement('label');
    label.className = "flex items-center gap-2 p-2 bg-slate-900/60 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-900 transition-all text-xs text-slate-200 select-none";
    
    const radio = document.createElement('input');
    radio.type = "radio";
    radio.name = "village";
    radio.value = v.village_name;
    radio.className = "w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500";
    
    if (v.village_name === autoSelectName) {
      radio.checked = true;
    }

    radio.addEventListener('change', () => {
      renderNeighborhoods(v.village_name);
    });

    const span = document.createElement('span');
    span.textContent = v.village_name;

    label.appendChild(radio);
    label.appendChild(span);
    villageGrid.appendChild(label);
  });
}

function renderNeighborhoods(villageName, autoCheckList = []) {
  if (checkboxGrid === null) return;
  checkboxGrid.innerHTML = '';

  if (activeDistrictObj === null || activeDistrictObj.villages === undefined) return;
  activeVillageObj = activeDistrictObj.villages.find((v) => v.village_name === villageName);
  
  if (activeVillageObj && activeVillageObj.neighborhoods && activeVillageObj.neighborhoods.length > 0) {
    checkboxGrid.className = "p-4 bg-slate-900 border border-slate-700 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm";
    
    activeVillageObj.neighborhoods.forEach((nh) => {
      const label = document.createElement('label');
      label.className = "flex items-center gap-2 p-2 bg-slate-800/40 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800 transition-all text-xs font-medium select-none";
      
      const checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.name = "neighborhoods";
      checkbox.value = nh;
      checkbox.className = "w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 rounded focus:ring-indigo-500";
      
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
}

document.getElementsByName('regency').forEach(radio => {
  radio.addEventListener('change', (e) => {
    const target = e.target;
    if (target instanceof HTMLInputElement) {
      renderDistricts(target.value);
    }
  });
});

const geoInputEl = document.getElementById('geo-search-input');
const resultsBox = document.getElementById('search-results-box');
const statusIcon = document.getElementById('search-status-icon');
const injectorConf = document.getElementById('injector-confirmation');
const injectorText = document.getElementById('injector-text');
const injectBtn = document.getElementById('inject-location-btn');

let searchIndex = [];
let selectedMatchItem = null;

const locationsList = window.BALI_LOCATIONS;
if (locationsList) {
  locationsList.forEach((reg) => {
    if (reg.districts) {
      reg.districts.forEach((dist) => {
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

if (geoInputEl instanceof HTMLInputElement && resultsBox !== null) {
  geoInputEl.addEventListener('input', (e) => {
    const target = e.target;
    if (target instanceof HTMLInputElement) {
      const query = target.value.trim().toUpperCase();
      resultsBox.innerHTML = '';
      if (statusIcon !== null) statusIcon.classList.add('hidden');
      if (injectorConf !== null) injectorConf.classList.add('hidden');

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
            
            if (injectorConf !== null && injectorText !== null) {
              injectorConf.classList.remove('hidden');
              if (item.type === 'village') {
                injectorText.innerHTML = "🌟 Found matching village: <strong>" + item.name + "</strong>.<br><span class='text-indigo-400'>Notice: Select your custom neighborhood box manually at the bottom once loaded!</span>";
              } else {
                injectorText.innerHTML = "🌟 Found exact neighborhood: <strong>" + item.name + "</strong>.<br><span class='text-emerald-400'>This will auto-check the neighborhood box parameters completely!</span>";
              }
            }
          });
          resultsBox.appendChild(row);
        });
      } else {
        resultsBox.classList.add('hidden');
      }
    }
  });
}

if (injectBtn !== null && geoInputEl instanceof HTMLInputElement) {
  injectBtn.addEventListener('click', () => {
    if (selectedMatchItem === null) return;

    const item = selectedMatchItem;
const regRadio = document.querySelector("input[name='regency'][value='" + item.regency + "']");if (regRadio instanceof HTMLInputElement) {regRadio.checked = true;}renderDistricts(item.regency, item.district);renderVillages(item.district, item.village);if (item.type === 'neighborhood') {renderNeighborhoods(item.village, [item.name]);} else {renderNeighborhoods(item.village, []);}if (injectorConf !== null) injectorConf.classList.add('hidden');if (statusIcon !== null) statusIcon.classList.add('hidden');geoInputEl.value = '';checkboxGrid?.scrollIntoView({ behavior: 'smooth', block: 'center' });});}

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

    
    const seekerForm = document.getElementById('seeker-form');const submitBtn = document.getElementById('submit-btn');if (seekerForm !== null) {seekerForm.addEventListener('submit', async (e) => {e.preventDefault();if (formAlert === null || !(submitBtn instanceof HTMLButtonElement) || !(budgetInput instanceof HTMLInputElement)) return;submitBtn.disabled = true;submitBtn.textContent = "Saving Profile...";const checkedBoxes = document.querySelectorAll('input[name="neighborhoods"]:checked');const selectedNHs = [];checkedBoxes.forEach((cb) => {if (cb instanceof HTMLInputElement) {selectedNHs.push(cb.value);}});const publishEl = document.getElementById('publish-profile');const isPublished = publishEl instanceof HTMLInputElement ? publishEl.checked : false;const mediaId = mediaIdInput instanceof HTMLInputElement ? parseInt(mediaIdInput.value) || '' : '';const budgetValue = parseInt(budgetInput.value) || 0;let selectedRegency = '';const regRadioChecked = document.querySelector('input[name="regency"]:checked');if (regRadioChecked instanceof HTMLInputElement) {selectedRegency = regRadioChecked.value;}let selectedDistrict = '';const distRadioChecked = document.querySelector('input[name="district"]:checked');if (distRadioChecked instanceof HTMLInputElement) {selectedDistrict = distRadioChecked.value;}let selectedVillage = '';const vilRadioChecked = document.querySelector('input[name="village"]:checked');if (vilRadioChecked instanceof HTMLInputElement) {selectedVillage = vilRadioChecked.value;}
    
        // Pull logged-in parameters from localStorage to fulfill the REST API's strict safety checks
      const storedEmail = localStorage.getItem('wp_user_email') || '';
      const storedName = localStorage.getItem('wp_user_name') || '';

      const updatePayload = {
        // 1. Core identification properties required by the master /users loop
        username: storedName,
        email: storedEmail,
        
        // 2. Your custom flatmate targeting parameters
        acf: {
          publish_profile_to_seekers: isPublished,
          profile_image: mediaId,
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
        // ✅ CORRECT ENDPOINT: Targets your live WordPress REST engine API loop directly
        const saveRes = await fetch('https://api.amcd.com.au/wp-json/wp/v2/users/me', {
          method: 'POST',
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
    });}