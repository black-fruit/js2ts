const fs = require('fs');
const path = require('path');
const recast = require('recast');
const { default: traverse } = require('babel-traverse');

// 读取 JavaScript 文件
const inputFile = 'input.js';
const outputFile = 'output.ts';

const code = fs.readFileSync(inputFile, 'utf-8');

// 使用 recast 解析代码
const ast = recast.parse(code);

// 对 AST 进行遍历，添加类型注解
traverse(ast, {
  // 你可以在这里添加更多的访问者方法来处理不同类型的节点

  // 对于函数声明，为参数和返回值添加类型注解
  FunctionDeclaration(path) {
    path.node.params.forEach(param => {
      param.typeAnnotation = {
        type: 'TypeAnnotation',
        typeAnnotation: {
          type: 'AnyTypeAnnotation' // 这里可以根据你的需要设置更准确的类型注解
        }
      };
    });

    if (!path.node.returnType) {
      path.node.returnType = {
        type: 'TypeAnnotation',
        typeAnnotation: {
          type: 'AnyTypeAnnotation' // 这里可以根据你的需要设置更准确的类型注解
        }
      };
    }
  }
});

// 将转换后的 AST 重新生成代码
const newCode = recast.print(ast).code;

// 将新代码写入 TypeScript 文件
fs.writeFileSync(outputFile, newCode, 'utf-8');

console.log(`JavaScript 文件已成功转换为 TypeScript，输出文件：${outputFile}`);
