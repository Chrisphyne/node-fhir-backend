import { prisma } from "../app";
import { FingerprintData } from "../types/biometricsTypes";

export async function createBiometricsRecord(officerId: number, fingerprintData: FingerprintData) {
    return prisma.biometrics.create({
        data: {
            officerId,
            ...fingerprintData
        }
    });
}

export async function updateBiometricsRecord(id: number, fingerprintData: Partial<FingerprintData>) {
    return prisma.biometrics.update({
        where: { id },
        data: fingerprintData
    });
}

export async function findBiometricsById(id: number) {
    return prisma.biometrics.findUnique({
        where: { id },
        include: { officer: true }
    });
}

export async function findAllBiometrics() {
    return prisma.biometrics.findMany({
        orderBy: { submissionDate: 'desc' },
        include: { officer: true }
    });
}

export async function findBiometricsByOfficerId(officerId: number) {
    return prisma.biometrics.findMany({
        where: { officerId },
        orderBy: { submissionDate: 'desc' },
        include: { officer: true }
    });
}

export async function deleteBiometricsById(id: number) {
    return prisma.biometrics.delete({
        where: { id }
    });
}
