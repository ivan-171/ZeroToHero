from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
html=(BASE/'index.html').read_text()
css=(BASE/'css/style.css').read_text()
js=(BASE/'js/app.js').read_text()
html=html.replace('<link rel="stylesheet" href="./css/style.css">','').replace('<script defer src="./js/app.js"></script>','')
css='\n'.join(line for line in css.splitlines() if not line.startswith('@import'))
with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  for width,height,name in [(390,844,'iphone'),(1365,850,'desktop')]:
    page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(html)
    page.add_style_tag(content=css)
    page.add_script_tag(content=js)
    page.wait_for_timeout(1200)
    print(name,'title',page.title(), 'stage',page.locator('#stage-tag').inner_text())
    page.locator('.modal-close').click()
    page.screenshot(path=f'/mnt/data/{name}-mendigo.png',full_page=True)
    before=page.locator('.stat-pill.gold .stat-number').inner_text()
    page.locator('#page [data-do="work"][data-id="beg"]').first.click()
    after=page.locator('.stat-pill.gold .stat-number').inner_text()
    navigation=page.locator('.mobile-nav [data-id="shop"]') if width<760 else page.locator('.sidebar [data-id="shop"]')
    navigation.click()
    print(name,'gold',before,'->',after,'shop',page.locator('.shop-card').count(),'errors',errors)
    assert page.locator('.shop-card').count()==10
    assert int(after)>int(before)
    assert not errors,errors
    page.close()
  browser.close()
