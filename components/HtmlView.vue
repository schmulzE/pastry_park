<script>
import { h } from "vue";

export default {
  props: {
    html: {
      type: String,
      required: true,
    },
    tags: {
      /** @type {import("vue").PropType<String[]>} */
      type: Array,
      default: () => ["b"],
    },
  },
  setup(props) {
    console.log(props.html);
    const html = parseHTML(props.html);
    // return the render function
    return () => {
      const output = [];
      html.childNodes.forEach((childNode) => {
        output.push(renderNode(childNode, props.tags));
      });
      if (output.length === 1) {
        return output[0];
      } else if (output.length === 0) {
        return "";
      }
      return output;
    };
  },
};

const parseHTML = (html) => {
  var template = document.createElement("template");
  template.innerHTML = html;
  return template.content;
};

/**
 *
 * @param {Node} node
 * @param {String[]} tags
 */
const renderNode = (node, tags) => {
  const nodeType = node.nodeType;
  if (nodeType === 1) {
    const nodeName = node.nodeName.toLocaleLowerCase();
    if (tags.includes(nodeName)) {
      const children = [];
      node.childNodes.forEach((childNode) => {
        children.push(renderNode(childNode, tags));
      });
      return h(nodeName, children);
    }
  }
  return node.textContent;
};
</script>
