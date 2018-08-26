import Jasmine from 'jasmine';

const jasmine = new Jasmine();
jasmine.loadConfigFile('server/spec/support/jasmine.json');
jasmine.execute();
