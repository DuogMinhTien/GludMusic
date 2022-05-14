(() => {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const glud_select = $$(".glud-select");

    function checkMultiSelected(element, selector_option, message = "Your select have multi selected") {
        let length_selected = element.querySelectorAll(selector_option + '[selected="true"]').length;
        if (length_selected > 1) {
            throw TypeError(`${message}
            • Your selected: ${length_selected}`);
        }

    }

    glud_select.forEach(item => {
        checkMultiSelected(item, '.glud-option');
        let glud_option = item.querySelectorAll(".glud-option");
        item.insertAdjacentHTML("afterbegin", `
            <label class="glud-title-select"></label>
            <div class="glud-select-child"></div>
        `);
        let glud_select_option = item.querySelector(".glud-select-child");
        let titleSelect = item.querySelector(".glud-title-select");
        let option_selected = item.querySelector('.glud-option[selected="true"]') ? item.querySelector('.glud-option[selected="true"]') : glud_option[0];
        option_selected.setAttribute("selected", "true");
        titleSelect.innerText = option_selected.innerText;
        glud_select_option.style.display = "none";
        item.onclick = () => {
            $$(".glud-select-child").forEach(hideItem => {
                if (hideItem.style.display != "none" && hideItem != glud_select_option) {
                    hideItem.style.display = "none";
                }
            })
            if (glud_select_option.style.display != "none") {
                glud_select_option.style.display = "none";
            } else {
                glud_select_option.style.display = "block";
            }
        }
        glud_option.forEach(item2 => {
            glud_select_option.appendChild(item2);
            item2.style.display = "block";
            item2.onclick = () => {
                item.querySelector('.glud-option[selected="true"]').setAttribute("selected", "false");
                item2.setAttribute("selected", "true");
                titleSelect.innerHTML = item2.innerText;
            }
        })
    });


    const glud_range = $$(".glud-range");
    glud_range.forEach(item => {
        if (item.min == '') item.min = 0;
        if (item.max == '') item.max = 100;
        if (item.step == '') item.step = 1;
        let activeBackground = getComputedStyle(item).getPropertyValue('--active-background');
        let normalBackground = getComputedStyle(item).getPropertyValue('--normal-background');
        item.changePercent = (value) => {
            let percent = value / (item.max - item.min) * 100;
            item.style['background'] = `linear-gradient(to right, ${activeBackground} 0%, ${activeBackground} ${percent}%, ${normalBackground} ${percent}%, ${normalBackground} 100%)`;
        }
        item.changePercent(item.value);
        item.oninput = () => {
            item.changePercent(item.value);
        }
        item.onchange = () => {
            item.changePercent(item.value);
        }
    })
})()