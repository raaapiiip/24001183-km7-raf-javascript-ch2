class App {
  constructor() {
    this.clearButton = document.getElementById("clear-btn");
    this.loadButton = document.getElementById("load-btn");
    this.carContainerElement = document.getElementById("cars-container");
    this.driverType = document.getElementById("driverType")
    this.dateOption = document.getElementById("dateOption")
    this.pickupTime = document.getElementById("pickupTime")
    this.passengerCount = document.getElementById("passengerCount")
  }

  async init() {
    await this.load();
    this.clearButton.onclick = this.clear;
    this.loadButton.onclick = this.run;
  }

  run = () => {
    Car.list.forEach((car) => {
      const node = document.createElement("div");
      node.classList.add("col-lg-4", "my-2");
      node.innerHTML = car.render();
      this.carContainerElement.appendChild(node);
    });
  };

  async load() {
    const cars = await Binar.listCars();
    Car.init(cars);
    console.log(cars)
  }

  async loadFilter() {
    const cars = await Binar.listCars((data) => {
      const tanggalJemputData = new Date(data.availableAt).getTime()
      const tanggal = new Date(`${this.dateOption.value} ${this.pickupTime.value}`).getTime()
      const checkWaktu = tanggalJemputData >= tanggal
      const availableAt = (this.driverType.value === 'true' && data.available ? true : false)
      const notAvailableAt = (this.driverType.value === 'false' && !data.available ? true : false)
      const penumpang = data.capacity >= this.passengerCount.value
      if (this.driverType.value !== 'default' && this.dateOption.value !== '' && this.pickupTime.value !== 'false' && this.passengerCount.value >= 0) {
        return (availableAt || notAvailableAt) && checkWaktu && penumpang
      } else if (this.driverType.value !== 'default' && this.passengerCount.value > 0) {
        return (availableAt || notAvailableAt) && penumpang
      } else if (this.dateOption.value !== '' && this.pickupTime.value !== 'false' && this.passengerCount.value > 0) {
        return checkWaktu && penumpang
      } else if (this.dateOption.value !== '' && this.pickupTime.value !== 'false') {
        return checkWaktu
      } else if (this.driverType.value !== 'default') {
        return (availableAt || notAvailableAt)
      } else {
        return penumpang
      }

    });
    console.log(cars)
    Car.init(cars);
  }

  clear = () => {
    let child = this.carContainerElement.firstElementChild;

    while (child) {
      child.remove();
      child = this.carContainerElement.firstElementChild;
    }
  };
}