export default function ({types: t}) {
  return {
    visitor: {
      FunctionDeclaration(path) {
        if(path.node.leadingComments){
        	 path.replaceWith(t.VariableDeclaration("var", [
             	t.VariableDeclarator(
                  path.node.id,
                  t.CallExpression(t.Identifier("g9.pure"), [t.FunctionExpression(null, path.node.params, path.node.body)])
                )
             ]));
        }
      }
    }
  };
}