import { WSStudyAngular2Page } from './app.po';

describe('ws-study-angular2 App', function() {
  let page: WSStudyAngular2Page;

  beforeEach(() => {
    page = new WSStudyAngular2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
