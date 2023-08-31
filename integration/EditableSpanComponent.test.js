const {toMatchImageSnapshot} = require("jest-image-snapshot");

describe('EditableSpan', () => {

    it('EditableSpan, visually looks correct', async () => {
        await page.goto('http://localhost:6006/iframe.html?id=editablespan-component--editable-span-base-example&viewMode=story')
        const image = await page.screenshot()
        expect(image).toMatchImageSnapshot()
    })
})