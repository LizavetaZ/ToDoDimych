const {toMatchImageSnapshot} = require("jest-image-snapshot");

describe('TaskComponent', () => {

    it('TaskComponent, visually looks correct', async () => {
        await page.goto('http://localhost:6006/iframe.html?id=task-component--task-base-example&viewMode=story')
        const image = await page.screenshot()
        expect(image).toMatchImageSnapshot()
    })
})