import type { Request, Response } from "express";


export async function fetchFeatures(req: Request, res: Response) {
  try {
    //@ts-ignore
    const { orgFeatures } = req.org;

    res.status(201).json({ message: "Features Fetched", orgFeatures });
  } catch (e) {
    console.error("Fetching Feature Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}

