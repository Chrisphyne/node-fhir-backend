import { FingerprintData } from "../types/biometricsTypes";

export const processFingerprintFiles = (files: Express.Multer.File[]): FingerprintData => {
    return {
        left_index: files.find((f) => f.fieldname === 'left_index')?.path || null,
        left_middle: files.find((f) => f.fieldname === 'left_middle')?.path || null,
        left_ring: files.find((f) => f.fieldname === 'left_ring')?.path || null,
        left_pinky: files.find((f) => f.fieldname === 'left_pinky')?.path || null,
        left_thumb: files.find((f) => f.fieldname === 'left_thumb')?.path || null,
        right_index: files.find((f) => f.fieldname === 'right_index')?.path || null,
        right_middle: files.find((f) => f.fieldname === 'right_middle')?.path || null,
        right_ring: files.find((f) => f.fieldname === 'right_ring')?.path || null,
        right_pinky: files.find((f) => f.fieldname === 'right_pinky')?.path || null,
        right_thumb: files.find((f) => f.fieldname === 'right_thumb')?.path || null,
        profile_photo: files.find(f => f.fieldname === 'profile_photo')?.path || null
    };
};

export const validateBiometricsInput = (officerId: unknown): number => {
    const id = Number(officerId);
    if (isNaN(id)) throw new Error("Invalid officer ID");
    return id;
};
