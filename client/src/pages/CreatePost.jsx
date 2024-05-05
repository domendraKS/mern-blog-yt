import { Button, FileInput, Select, TextInput } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  return (
    <>
      <div className="p-3 text-center min-h-screen mx-auto max-w-3xl">
        <h1 className="text-center text-3xl font-semibold my-7">
          Create a Post
        </h1>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              id="title"
              placeholder="Title"
              required
              className="flex-1"
            />
            <Select>
              <option>Select a category</option>
              <option value="JavaScript">JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>
          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-2">
            <FileInput type="file" accept="image/*" />
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              sm="sm"
              outline
            >
              Upload Image
            </Button>
          </div>
          <ReactQuill
            theme="snow"
            placeholder="Write something..."
            className="h-64 mb-12"
            required
          />
          <Button type="submit" gradientDuoTone="purpleToPink">
            Publish
          </Button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
