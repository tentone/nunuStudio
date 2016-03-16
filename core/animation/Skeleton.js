function Skeleton()
{
	this.root = new Joint("");
}

Skeleton.prototype.createJoints = createJoints;
Skeleton.prototype.updateJoints = updateJoints;

//Create joint structure from name array
function createJoints(names)
{
	for(var i = 0; i < names.length; i++)
	{
		var parent = this.root.getChildren(names[i][0]);

		//If parent dosent exist create root
		if(parent == null)
		{
			this.root = new Joint(names[i][0]);
			this.root.add(new Joint(names[i][1]));
		}

		//If parent exists add joint to parent
		else
		{
			parent.add(new Joint(names[i][1]));
		}
	}
}

//Update Points and recaulate bone meshes
function updateJoints(joints)
{
	for(var i = 0; i < joints.length; i++)
	{
		var joint = this.root.getChildren(joints[i].name);
		if(joint != null)
		{
			joint.position.set(joints[i].x, joints[i].y, joints[i].z);
		}
	}
}
