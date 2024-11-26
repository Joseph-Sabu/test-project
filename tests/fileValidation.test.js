// fileValidation.test.js
describe('File Validation Tests', () => {
    it('should allow valid .xlsx file upload', () => {
        const file = { name: 'test-file.xlsx' };
        const allowedExtensions = /(\.xlsx)$/i;
        expect(allowedExtensions.exec(file.name)).not.toBeNull();
    });

    it('should reject invalid file types', () => {
        const file = { name: 'test-file.txt' };
        const allowedExtensions = /(\.xlsx)$/i;
        expect(allowedExtensions.exec(file.name)).toBeNull();
    });

    it('should reject invalid file types', () => {
        const file = { name: 'test-file.doc' };
        const allowedExtensions = /(\.xlsx)$/i;
        expect(allowedExtensions.exec(file.name)).toBeNull();
    });

    it('should reject invalid file types', () => {
        const file = { name: 'test-file.ppt' };
        const allowedExtensions = /(\.xlsx)$/i;
        expect(allowedExtensions.exec(file.name)).toBeNull();
    });

    it('should reject invalid file types', () => {
        const file = { name: 'test-file.jpg' };
        const allowedExtensions = /(\.xlsx)$/i;
        expect(allowedExtensions.exec(file.name)).toBeNull();
    });

    it('should reject invalid file types', () => {
        const file = { name: 'test-file.mkv' };
        const allowedExtensions = /(\.xlsx)$/i;
        expect(allowedExtensions.exec(file.name)).toBeNull();
    });

    it('should reject invalid file types', () => {
        const file = { name: 'test-file.mp4' };
        const allowedExtensions = /(\.xlsx)$/i;
        expect(allowedExtensions.exec(file.name)).toBeNull();
    });

    it('should reject invalid file types', () => {
        const file = { name: 'test-file.exe' };
        const allowedExtensions = /(\.xlsx)$/i;
        expect(allowedExtensions.exec(file.name)).toBeNull();
    });

    it('should reject invalid file types', () => {
        const file = { name: 'test-file.dll' };
        const allowedExtensions = /(\.xlsx)$/i;
        expect(allowedExtensions.exec(file.name)).toBeNull();
    });
});
