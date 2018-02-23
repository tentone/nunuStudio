"use strict";

/**
 * TreeUtils used to compare Tree.
 *
 * Can also be used to compare Object structure.
 *
 * @static
 * @class TreeUtils
 */
function TreeUtils(){}

/**
 * Flag used to indicate ADDED diff.
 * 
 * @attribute DIFF_ADDED
 * @type {Number}
 */
TreeUtils.DIFF_ADDED = 0;

/**
 * Flag used to indicate REMOVED diff.
 * 
 * @attribute DIFF_REMOVED
 * @type {Number}
 */
TreeUtils.DIFF_REMOVED = 1;

/**
 * Flag used to indicate MOVED diff.
 * 
 * @attribute DIFF_MOVED
 * @type {Number}
 */
TreeUtils.DIFF_MOVED = 2;

/**
 * Compare two trees and return list of changes.
 *
 * oldTree is compared to newTree. The list of changes indicate wath needs to be changed in oldTree to become wqual to the newTree.
 *
 * Elements inside Trees are compared using their UUID.
 *
 * The array returned from this method contains objects in the format {status:<Operation>, uuid: <UUID>, from: <Tree>, to: <Tree>}
 *
 * @static
 * @method compare
 * @param {Tree} oldTree Old version of Tree.
 * @param {Tree} newTree New version of Tree.
 * @param {Array} diffs Recursive parameter (optional).
 * @param {Array} pathOldTree Recursive parameter (optional).
 * @param {Array} pathNewTree Recursive parameter (optional).
 * @return {Array} Array with diffs between oldTree and newTree.
 */
TreeUtils.compare = function(oldTree, newTree, diffs, pathOldTree, pathNewTree)
{
	//Differences array
	if(diffs === undefined)
	{
		diffs = [];
	}

	//Path to this tree point in positions
	if(pathOldTree === undefined)
	{
		pathOldTree = [];
	}
	if(pathNewTree === undefined)
	{
		pathNewTree = [];
	}

	var oldChildren = oldTree.children;
	var oldLength = oldChildren.length;

	var newChildren = newTree.children;
	var newLength = newChildren.length;

	var i = 0, j = 0;
	
	while(i < oldLength && j < newLength)
	{
		//Different element
		if(oldChildren[i].uuid !== newChildren[j].uuid)
		{
			/*
			//Check if elements were removed
			for(var k = i + 1; k < oldChildren.length; k++)
			{
				//Found matching element
				if(oldChildren[k].uuid === newChildren[j].uuid)
				{
					for(var l = i; l < k; l++)
					{
						var from = pathOldTree.slice(0);
						from.push(l);
						diffs.push({status: TreeUtils.DIFF_REMOVED, uuid: oldChildren[l].uuid, from: from, to: null});
					}

					i = k;
					break;
				}
			}
			
			//Check if elements were added
			for(var k = j + 1; k < newChildren.length; k++)
			{
				//Found matching element
				if(newChildren[k].uuid === oldChildren[i].uuid)
				{
					for(var l = j; l < k; l++)
					{
						var from = pathOldTree.slice(0);
						from.push(l);
						diffs.push({status: TreeUtils.DIFF_REMOVED, uuid: newChildren[l].uuid, from: from, to: null});
					}

					j = k;
					break;
				}
			}
			*/
			//Element removed
			if((i + 1) < oldLength && oldChildren[i + 1].uuid === newChildren[j].uuid)
			{
				var from = pathOldTree.slice(0);
				from.push(i);
				
				diffs.push({status: TreeUtils.DIFF_REMOVED, uuid: oldChildren[i].uuid, from: from, to: null});
				i++;
			}
			//Element added
			else if((j + 1) < newLength && oldChildren[i].uuid === newChildren[j + 1].uuid)
			{
				var to = pathNewTree.slice(0);
				to.push(j);

				diffs.push({status: TreeUtils.DIFF_ADDED, uuid: newChildren[j].uuid, from: null, to: to});
				j++;
			}
		}

		//If element is the same compare its children
		if(oldChildren[i].uuid === newChildren[j].uuid)
		{
			var from = pathOldTree.slice(0);
			from.push(i);
			
			var to = pathNewTree.slice(0);
			to.push(j);

			TreeUtils.compare(oldChildren[i], newChildren[j], diffs, from, to);
		}

		i++;
		j++;
	}

	//Remaining elements missing in A
	while(i < oldLength)
	{
		var from = pathOldTree.slice(0);
		from.push(i);

		diffs.push({status: TreeUtils.DIFF_REMOVED, uuid: oldChildren[i].uuid, from: from, to: null});
		i++;
	}

	//Extra elements added in B
	while(j < newLength)
	{
		var to = pathNewTree.slice(0);
		to.push(j);

		diffs.push({status: TreeUtils.DIFF_ADDED, uuid: newChildren[j].uuid, from: null, to: to});
		j++;
	}

	//Check if some elements have removed and added status at same time
	/*for(var i = 0; i < diffs.length; i++)
	{
		for(var j = 0; j < diffs.length; j++)
		{
			if(diffs[i].uuid === diffs[j].uuid)
			{
				if(diffs[i].status === TreeUtils.DIFF_REMOVED && diffs[j].status === TreeUtils.DIFF_ADDED)
				{
					diffs[i].status = TreeUtils.DIFF_MOVED;
					diffs[i].to = diffs[j].to;
					diffs.splice(j, 1);
				}
				else if(diffs[j].status === TreeUtils.DIFF_REMOVED && diffs[i].status === TreeUtils.DIFF_ADDED)
				{
					diffs[i].status = TreeUtils.DIFF_MOVED;
					diffs[i].from = diffs[j].from;
					diffs.splice(j, 1);
				}
			}
		}
	}*/

	return diffs;
};

/**
 * Print tree into console, recursively.
 *
 * Trees are represented by a UUID a parent and a children array.
 *
 * @method print
 * @param {Tree} tree Tree object to be printed.
 * @param {Number} level Recursive parameter, not required.
 */
TreeUtils.print = function(tree, level)
{
	if(level === undefined)
	{
		level = 1;
	}

	var space = "";
	for(var i = level - 1; i > 0; i--)
	{
		space += "----";
	}
	space += "--->";

	for(var i = 0; i < tree.children.length; i++)
	{
		console.log(space + tree.children[i].uuid);
		TreeUtils.print(tree.children[i], level + 1);
	}
};


/**
 * Unit test for tree comparison.
 *
 * Prints information into the console.
 * 
 * @method test
 */
TreeUtils.test = function()
{
	console.log("Tree Comparison");

	console.log("Tree A");
	var treeA = new Tree("root");
	treeA.add(new Tree("a"));
	var b = new Tree("b");
	newTree.add(new Tree("ba"));
	newTree.add(new Tree("bb"));
	newTree.add(new Tree("bc"));
	var bd = new Tree("bd");
	newTree.add(bd);
	treeA.add(b);
	treeA.add(new Tree("c"));
	var d = new Tree("d");
	treeA.add(d);
	treeA.add(new Tree("e"));
	treeA.add(new Tree("f"));
	treeA.print();

	console.log("\nTree B");
	var treeB = treeA.clone();
	treeB.remove(b);
	treeB.print();

	console.log("\nTree C");
	var treeC = treeA.clone();
	treeC.remove(b);
	treeC.remove(d);
	treeC.add(d);
	treeC.print();

	console.log("\nTree D");
	var treeD = treeA.clone();
	treeD.children[1].remove(bd);
	treeD.print();

	console.log("\nCompare A to B");
	console.log(TreeUtils.compare(treeA, treeB));

	console.log("\nCompare A to C");
	console.log(TreeUtils.compare(treeA, treeC));

	console.log("\nCompare A to D");
	console.log(TreeUtils.compare(treeA, treeD));

	console.log("\nCompare B to A");
	console.log(TreeUtils.compare(treeB, treeA));
};
