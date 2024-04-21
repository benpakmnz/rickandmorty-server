import { NextFunction, Request, Response } from "express";
import { LocationModel } from "../models/location";
import axios from "axios";
import { getIsAdmin } from "../common/helpers/isAdmin";

export const getAllLocations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locations = await LocationModel.find();
    res.status(201).send(locations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch locations", error });
  }
};

export const getLocationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    let location = await LocationModel.findOne({ id: id });
    if (location === null) {
      const isAdmin = await getIsAdmin(req);
      if (isAdmin) {
        try {
          const response = await axios.get(
            `https://rickandmortyapi.com/api/location/${id}`
          );
          const externalLocation = response.data;
          const residents = handleCharactersPath(externalLocation.residents);

          const fetchedLocation = {
            id: externalLocation.id,
            name: externalLocation.name,
            dimension: externalLocation.dimension,
            type: externalLocation.type,
            residents: residents,
            isExternal: true,
          };

          return res.status(200).json(fetchedLocation);
        } catch (error) {
          console.log("Error fetching from external API:", error);
          return res.status(404).json({ message: "Location not found" });
        }
      }
    }

    res.status(201).send(location);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch location", error });
  }
};

export const getLocationsByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const nameParam = req.params.name;
    const isAdmin = await getIsAdmin(req);
    let locations = await getLocationsFromDB(nameParam);
    let responseData;

    if (isAdmin) {
      const externalApiResponse = await getLocationsFromExternalAPI(nameParam);
      const combinedResults = [
        ...locations.map((location) => location.toObject()),
        ...externalApiResponse,
      ];

      responseData = removeDuplicates(combinedResults);
    } else {
      responseData = locations;
    }

    res.status(201).send(responseData);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch locations", error });
  }
};

export const getResidents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const residentsList: string[] = req.body.residentsIds;
    if (residentsList.length <= 0) return res.status(201).send([]);
    const externalApiResponse = await axios.get(
      `https://rickandmortyapi.com/api/character/${residentsList}`
    );
    const data =
      residentsList.length === 1
        ? [externalApiResponse.data]
        : externalApiResponse.data;
    res.status(201).send(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch charecters", error });
  }
};

const handleCharactersPath = (charectersPathString: string[]): string[] => {
  return charectersPathString.map((path) => {
    const pathArr = path.split("/");
    return pathArr[pathArr.length - 1];
  });
};

const getLocationsFromExternalAPI = async (name: string) => {
  try {
    const response = await axios.get(
      `https://rickandmortyapi.com/api/location/?name=${name}`
    );
    return response.data.results;
  } catch (error) {
    return [];
  }
};

const getLocationsFromDB = async (name: string) => {
  return await LocationModel.find({
    name: { $regex: name, $options: "i" },
  });
};

const removeDuplicates = (locations: any[]) => {
  const resultMap = new Map();
  locations.forEach((location) => {
    resultMap.set(location.id, location);
  });
  return Array.from(resultMap.values());
};
