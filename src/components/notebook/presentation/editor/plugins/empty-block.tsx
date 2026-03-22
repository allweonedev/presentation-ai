import { createTPlatePlugin } from "platejs/react";

export const EmptyBlockPlugin = createTPlatePlugin({
  key: "only-when-empty",
  handlers: {
    onChange: ({ editor, value }) => {
      // Check if the editor effectively has no children or is in an invalid state
      const isEmpty = !value || value.length === 0;
      if (isEmpty) {
        // Insert a default paragraph if completely empty
        editor.tf.insertNode({
          type: "p", // Make sure this matches your paragraph type key
          children: [{ text: "" }],
        });
      }
    },
  },
});
