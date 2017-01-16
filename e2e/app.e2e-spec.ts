import { GamesOnPaperPage } from './app.po';

describe('games-on-paper App', function() {
  let page: GamesOnPaperPage;

  beforeEach(() => {
    page = new GamesOnPaperPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
