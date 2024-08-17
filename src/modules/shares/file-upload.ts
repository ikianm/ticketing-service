import { diskStorage } from "multer";
import { mkdirSync } from 'node:fs';
import { generate } from 'randomstring';
import { extname } from "node:path";

export const storage = diskStorage({
    destination: (req, file, cb) => {
        const dir = `./public/uploads/${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDate()}`;
        mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: async (req, file, cb) => {
        const randomName = generate({
            length: 3,
            charset: 'numeric'
        });
        cb(null, `${randomName}${new Date().getTime()}${extname(file.originalname)}`);
    }
});

export const fileFilter = (req: any, file: any, cb: any) => {
    const allowedFileTypes = /jpeg|jpg|png|zip/;
    const isValidFileType = allowedFileTypes.test(extname(file.originalname).toLowerCase());
    const isValidMimeType = allowedFileTypes.test(file.mimetype);

    if (isValidMimeType && isValidFileType) return cb(null, true);
    req.fileError = 'تنها فایلهایی با پسوند jpeg, jpg, png و zip را میتوان ارسال کرد';
    cb(null, false);
}