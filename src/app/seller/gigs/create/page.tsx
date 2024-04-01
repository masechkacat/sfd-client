"use client";
import { useCreateGig } from "@/request-query/configRequests";
import ImageUpload from "../../../../components/imageUpload";
import { categories } from "../../../../utils/categories";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormData {
  title: string;
  category: string;
  description: string;
  deliveryTime: string;
  revisions: string;
  features: string[]; // Указываем, что это массив строк
  price: string;
  shortDesc: string;
}

function CreateGigs() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    description: "",
    deliveryTime: "",
    revisions: "",
    features: [],
    price: "",
    shortDesc: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const { mutate: createGig } = useCreateGig();
  const [featureInput, setFeatureInput] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "feature") {
      setFeatureInput(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Проверьте, заполнены ли все поля
    const allFieldsFilled = Object.values({ ...formData, [name]: value }).every(
      (field) => field !== ""
    );
    setIsFormComplete(allFieldsFilled);
  };

  const addGig = (e: React.FormEvent) => {
    e.preventDefault();

    const uploadData = new FormData();

    // Добавляем все поля кроме 'features' и 'images'
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "features") {
        // Пропускаем 'features', так как они будут обработаны отдельно
        uploadData.append(key, value.toString()); // Преобразуем все значения к строке для безопасности
      }
    });

    // Для массива features добавляем каждую характеристику отдельно
    formData.features.forEach((feature) => {
      uploadData.append("features", feature);
    });

    // Добавляем файлы
    files.forEach((file) => {
      uploadData.append("images", file); // Используем 'images' как ключ для всех файлов
    });

    createGig(uploadData, {
      onSuccess: () => {
        router.push("/seller/gigs");
      },
    });
  };

  const addFeature = () => {
    if (featureInput) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        features: [...prevFormData.features, featureInput],
      }));
      setFeatureInput(""); // Clear the input after adding
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      features: prevFormData.features.filter((_, idx) => idx !== index),
    }));
  };

  const inputClassName =
    "block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500";
  const labelClassName = "mb-2 text-lg font-medium text-gray-900 ";
  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32 pt-28">
      <h1 className="text-6xl text-gray-900 mb-5">Create a new Gig</h1>
      <h3 className="text-3xl text-gray-900 mb-5">
        Enter the details to create the gig
      </h3>
      <form onSubmit={addGig} className="flex flex-col gap-5 mt-10">
        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="title" className={labelClassName}>
              Gig Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              id="title"
              className={inputClassName}
              placeholder="e.g. I will do something I'm really good at"
              required
            />
          </div>
          <div>
            <label htmlFor="categories" className={labelClassName}>
              Select a Category
            </label>
            <select
              id="categories"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
              name="category"
              onChange={handleChange}
            >
              <option disabled selected value="">
                Choose a Category
              </option>
              {categories.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="description" className={labelClassName}>
            Gig Description
          </label>
          <textarea
            id="description"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write a short description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="delivery">Delivery Time</label>
            <input
              type="number"
              className={inputClassName}
              id="delivery"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              placeholder="Minimum Delivery Time"
            />
          </div>
          <div>
            <label htmlFor="revision" className={labelClassName}>
              Revisions
            </label>
            <input
              type="number"
              id="revision"
              className={inputClassName}
              placeholder="Max Number of Revisions"
              name="revisions"
              value={formData.revisions}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="features" className={labelClassName}>
              Features
            </label>
            <div className="flex gap-3 items-center mb-5">
              <input
                type="text"
                id="features"
                className={inputClassName}
                placeholder="Enter a Feature Name"
                name="feature"
                value={featureInput} // Use featureInput here
                onChange={handleChange}
              />
              <button
                type="button"
                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800  font-medium  text-lg px-10 py-3 rounded-md "
                onClick={addFeature}
              >
                Add
              </button>
            </div>
            <ul className="flex gap-2 flex-wrap">
              {formData.features.map((feature: string, index: number) => (
                <li
                  key={`${feature}-${index}`}
                  className="flex gap-2 items-center py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 cursor-pointer hover:border-red-200"
                >
                  <span>{feature}</span>
                  <span
                    className="text-red-700 cursor-pointer"
                    onClick={() => removeFeature(index)}
                  >
                    X
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label htmlFor="image" className={labelClassName}>
              Gig Images
            </label>
            <div>
              <ImageUpload files={files} setFile={setFiles} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="shortDesc" className={labelClassName}>
              Short Description
            </label>
            <input
              type="text"
              className={`${inputClassName} w-1/5`}
              id="shortDesc"
              placeholder="Enter a short description."
              name="shortDesc"
              value={formData.shortDesc}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="price" className={labelClassName}>
              Gig Price ( $ )
            </label>
            <input
              type="number"
              className={`${inputClassName} w-1/5`}
              id="price"
              placeholder="Enter a price"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <button
            className="border text-lg font-semibold px-5 py-3 border-[#1DBF73] bg-[#1DBF73] text-white rounded-md disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-800"
            type="submit"
            disabled={!isFormComplete}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGigs;
