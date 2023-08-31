const {toMatchImageSnapshot} = require("jest-image-snapshot");
describe('addItemForm', () => {
    it('base example, visually looks correct', async () => {
            await page.goto('http://localhost:6006/iframe.html?id=additemform-component--add-item-form-base-example&viewMode=story')
        const image = await page.screenshot()
        expect(image).toMatchImageSnapshot()
    })
})

