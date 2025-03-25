import { Request, Response } from "express";
import { prisma } from "../app";

// Create a new qualification and skill
export const createQualificationAndSkill = async (req: Request, res: Response) => {
    const { certification, skills, years_of_experience, languages, officerId } = req.body;

    try {
        const newQualificationAndSkill = await prisma.qualification_And_Skills.create({
            data: {
                certification,
                skills,
                years_of_experience,
                languages,
                officerId
            }
        });

        res.status(201).json({
            message: "Qualification and Skill created successfully",
            data: newQualificationAndSkill
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the Qualification and Skill' });
    }
};

// Get all qualifications and skills
export const getAllQualificationsAndSkills = async (req: Request, res: Response) => {
    try {
        const qualificationsAndSkills = await prisma.qualification_And_Skills.findMany({
            orderBy: {
                id: 'desc',
            },
            include: {
                officer: true
            }
        });

        res.json({
            message: "All Qualifications and Skills fetched successfully",
            data: qualificationsAndSkills
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching Qualifications and Skills' });
    }
};

// Get a qualification and skill by ID
export const getQualificationAndSkillById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const qualificationAndSkill = await prisma.qualification_And_Skills.findUnique({
            where: { id: parseInt(id) },
            include: {
                officer: true
            }
        });

        if (!qualificationAndSkill) {
            return res.status(404).json({ message: 'Qualification and Skill not found' });
        }

        res.json({
            message: "Qualification and Skill fetched successfully",
            data: qualificationAndSkill
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the Qualification and Skill' });
    }
};

// Update a qualification and skill by ID
export const updateQualificationAndSkill = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { certification, skills, years_of_experience, languages, officerId } = req.body;

    try {
        const updatedQualificationAndSkill = await prisma.qualification_And_Skills.update({
            where: { id: parseInt(id) },
            data: {
                certification,
                skills,
                years_of_experience,
                languages,
                officerId
            }
        });

        res.json({
            message: "Qualification and Skill updated successfully",
            data: updatedQualificationAndSkill
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the Qualification and Skill' });
    }
};

// Delete a qualification and skill by ID
export const deleteQualificationAndSkill = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.qualification_And_Skills.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the Qualification and Skill' });
    }
};  