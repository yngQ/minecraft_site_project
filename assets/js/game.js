(function () {
  var oreBtn = document.getElementById("ore-btn");
  if (!oreBtn) {
    return;
  }

  var scoreEl = document.getElementById("score");
  var levelEl = document.getElementById("level");
  var powerEl = document.getElementById("power");
  var upgradeBtn = document.getElementById("upgrade-btn");
  var resetBtn = document.getElementById("reset-btn");
  var upgradeCostEl = document.getElementById("upgrade-cost");
  var pickaxeImageEl = document.getElementById("pickaxe-image");
  var pickaxeMaterialEl = document.getElementById("pickaxe-material");

  var state = {
    score: 0,
    level: 1,
    power: 1
  };

  var pickaxeTiers = [
    { minLevel: 1, name: "Деревянная", image: "assets/images/pickaxe-wood.svg" },
    { minLevel: 2, name: "Каменная", image: "assets/images/pickaxe-stone.svg" },
    { minLevel: 3, name: "Железная", image: "assets/images/pickaxe-iron.svg" },
    { minLevel: 4, name: "Алмазная", image: "assets/images/pickaxe-diamond.svg" },
    { minLevel: 5, name: "Незеритовая", image: "assets/images/pickaxe-netherite.svg" }
  ];

  function getUpgradeCost(level) {
    return level * 20;
  }

  function getPickaxeTier(level) {
    var selected = pickaxeTiers[0];
    for (var i = 0; i < pickaxeTiers.length; i += 1) {
      if (level >= pickaxeTiers[i].minLevel) {
        selected = pickaxeTiers[i];
      }
    }
    return selected;
  }

  function saveState() {
    localStorage.setItem("mc_clicker_state_v1", JSON.stringify(state));
  }

  function loadState() {
    var raw = localStorage.getItem("mc_clicker_state_v1");
    if (!raw) {
      return;
    }
    try {
      var parsed = JSON.parse(raw);
      if (typeof parsed.score === "number" && typeof parsed.level === "number" && typeof parsed.power === "number") {
        state = parsed;
      }
    } catch (err) {
      state = { score: 0, level: 1, power: 1 };
    }
  }

  function renderPickaxe() {
    if (!pickaxeImageEl || !pickaxeMaterialEl) {
      return;
    }
    var tier = getPickaxeTier(state.level);
    pickaxeImageEl.setAttribute("src", tier.image);
    pickaxeImageEl.setAttribute("alt", "Кирка: " + tier.name.toLowerCase());
    pickaxeMaterialEl.textContent = tier.name;
  }

  function render() {
    scoreEl.textContent = state.score;
    levelEl.textContent = state.level;
    powerEl.textContent = state.power;
    upgradeCostEl.textContent = getUpgradeCost(state.level);
    upgradeBtn.disabled = state.score < getUpgradeCost(state.level);
    renderPickaxe();
  }

  function burstEffect(x, y, text) {
    var burst = document.createElement("span");
    burst.className = "click-burst";
    burst.textContent = text;
    burst.style.left = x + "px";
    burst.style.top = y + "px";
    oreBtn.appendChild(burst);
    setTimeout(function () {
      burst.remove();
    }, 620);
  }

  oreBtn.addEventListener("click", function (event) {
    state.score += state.power;
    render();
    saveState();

    var rect = oreBtn.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    burstEffect(x, y, "+" + state.power);
  });

  upgradeBtn.addEventListener("click", function () {
    var cost = getUpgradeCost(state.level);
    if (state.score < cost) {
      return;
    }
    state.score -= cost;
    state.level += 1;
    state.power += 1;
    render();
    saveState();
  });

  resetBtn.addEventListener("click", function () {
    state = { score: 0, level: 1, power: 1 };
    render();
    saveState();
  });

  loadState();
  render();
})();
