const openForm = (id: number, setState: (state: string) => void) => {
  setState(`FORM-${id}`);
};

const closeForm = (setState: (state: string) => void) => {
  setState("LIST");
};

const openAbout = (setState: (state: string) => void) => {
  setState("ABOUT");
};

const openList = (setState: (state: string) => void) => {
  setState("LIST");
};

const closeList = (setState: (state: string) => void) => {
  setState("HOME");
};

module.exports = {
  openForm: openForm,
  closeForm: closeForm,
  openAbout: openAbout,
  openList: openList,
  closeList: closeList,
};
