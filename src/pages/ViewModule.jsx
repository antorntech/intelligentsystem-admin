import {
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../loader/Loader";

const ViewModule = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [modules, setModules] = useState([]);
  const [title, setTitle] = useState("");
  useEffect(() => {
    const storedTrainings =
      JSON.parse(localStorage.getItem("trainingsData")) || [];
    const trainingData = storedTrainings.find(
      (training) => training.id === parseInt(id)
    );
    const moduleList = trainingData.module;
    setTitle(trainingData.title);
    setModules(moduleList);
  }, [id]);
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/trainings")}
            className="flex items-center justify-center gap-1 text-black border-2 border-black px-2 py-2 rounded-md text-sm hover:bg-black hover:text-white transition-all duration-500"
          >
            <i class="fa-solid fa-hand-point-left"></i>
          </button>
          <div>
            <h1 className="text-xl font-bold">
              Module list of "<span className="text-blue-500">{title}</span>".
            </h1>
            <p className="text-sm text-gray-500">
              modules are {modules.length > 0 ? "" : "not"} available here.
            </p>
          </div>
        </div>
        <div>
          <div>
            <Link to={`/trainings/add-module/${id}`}>
              <button className="w-[130px] flex items-center justify-center gap-1 text-white border-2 border-green-700 px-2 py-2 rounded-md text-sm bg-green-700 hover:bg-green-500 hover:border-green-500 transition-all duration-500">
                Add Module
                <i class="fa-solid fa-plus"></i>
              </button>
            </Link>
          </div>
        </div>
      </div>
      {modules.length > 0 ? (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Module Title
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Module Sub Title
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Module List
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b">
                    <h1 className="text-sm font-bold">{module.title}</h1>
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-500">
                    {module.subTitle}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-500">
                    <Popover placement="bottom-end">
                      <PopoverHandler>
                        <button className="text-cyan-700 border-2 border-cyan-700 px-2 py-1 rounded-md text-sm hover:bg-cyan-700 hover:text-white transition-all duration-500">
                          View List ({module.lists.length})
                          <i class="fa-solid fa-eye ml-1"></i>
                        </button>
                      </PopoverHandler>
                      <PopoverContent className="bg-gray-200 shadow-lg border-2 border-gray-300">
                        {module.lists.map((list) => (
                          <li
                            key={list.id}
                            className="list-disc list-inside text-sm text-gray-800"
                          >
                            {list}
                          </li>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </td>
                  <td className="px-6 py-4 border-b text-sm">
                    <div className="flex items-center gap-2">
                      <Link to={`/trainings/edit-module/${id}/${module.id}`}>
                        <button className="text-orange-800 border-2 border-orange-800 px-2 py-1 rounded-md text-sm hover:bg-orange-800 hover:text-white transition-all duration-500">
                          <i class="fa-solid fa-pencil"></i>
                        </button>
                      </Link>
                      <button
                        onClick={() => openDeleteConfirmModal(module.id)}
                        className="text-red-800 border-2 border-red-800 px-2 py-1 rounded-md text-sm hover:bg-red-800 hover:text-white transition-all duration-500"
                      >
                        <i class="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default ViewModule;
