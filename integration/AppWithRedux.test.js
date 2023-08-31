const {toMatchImageSnapshot} = require("jest-image-snapshot");

describe('AppWithRedux', () => {

    it('AppWithRedux, visually looks correct', async () => {
        await page.goto('http://localhost:6006/iframe.html?id=app-with-redux--app-with-redux-base-example&viewMode=story')
        const image = await page.screenshot()
        expect(image).toMatchImageSnapshot()
    })
})