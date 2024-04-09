class customDatalist {

    constructor(element) {
        this.element = element;
        this.oldDatalist = this.element.list;
        this.newDatalist = null;

        this.createNewDatalist();
        this.removeOldDatalist();
        this.applyEvents();
    }

    getAllData() {
        const dataList = this.oldDatalist;
        const options = dataList.querySelectorAll('option');
        
        let data = [];
        
        options.forEach(option => {
            data.push({
                bobina: option.getAttribute('value'),
                label: option.textContent.trim()
            });
        });

        return data;
    }

    createNewDatalist() {
        const dataList = this.getAllData();
        
        const div = document.createElement('div');
        div.className = 'new-datalist';
        div.tabIndex = 0;
        div.id = this.oldDatalist.id;

        const ul = document.createElement('ul');

        dataList.forEach(item => {
            const li = document.createElement('li');
            const label = document.createElement('label');

            const valueDiv = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            const valueSpan = document.createElement('span');
            const labelP = document.createElement('p');

            valueSpan.textContent = item.bobina;
            labelP.textContent = item.label;

            valueDiv.appendChild(checkbox);
            valueDiv.appendChild(valueSpan);
            label.appendChild(valueDiv);
            label.appendChild(labelP);
            li.appendChild(label);
            ul.appendChild(li);
        });

        div.appendChild(ul);
        this.element.readOnly = true;

        this.element.insertAdjacentElement('afterend', div);

        this.newDatalist = div;
    }

    removeOldDatalist() {
        this.oldDatalist.remove();
    }
    
    applyEvents() {
        this.element.addEventListener('click', this.showDatalist.bind(this));
        document.addEventListener('click', this.hiddeDatalist.bind(this));
    }

    hiddeDatalist(event) {
        console.log(event.target);

        if (event.target == this.element
         || this.newDatalist.contains(event.target)
         || !this.newDatalist.classList.contains('active-datalist') ) {
            return;
        }
        
        this.newDatalist.classList.remove('active-datalist');
    }

    showDatalist(event) {
        this.newDatalist.classList.add('active-datalist');

        let windowWidth = window.innerWidth;
        let top = this.element.offsetTop + this.element.offsetHeight;
        let left = Math.max(this.element.offsetLeft + (this.element.offsetWidth / 2) - (this.newDatalist.offsetWidth / 2), 0);
        let overflowRight = Math.max((left + this.newDatalist.offsetWidth) - windowWidth, 0);

        if (overflowRight) {
            left -= overflowRight;
        }

        this.newDatalist.style.top = `${top}px`;
        this.newDatalist.style.left = `${left}px`;

        this.newDatalist.focus();
    }
}

Object.defineProperty(Element.prototype, 'customDatalist', {
    value: function() {
        return new customDatalist(this);
    }
});