Vec3 = function( x, y, z )
{
    this.x = x;
    this.y = y;
    this.z = z;
    this.num = [this.x, this.y, this.z]
    this.num.sort();
}

// Add method
Vec3.prototype.add = function( v )
{
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
}
// Sum method
Vec3.prototype.sum = function()
{
    return this.x + this.y + this.z;
}
// Min method
Vec3.prototype.min = function()
{
    return this.num[0]
}
//Mid method
Vec3.prototype.mid = function()
{
    return this.num[1]
}
//Max method
Vec3.prototype.max = function()
{
    return this.num[2]
}
//Area method
Vec3.prototype.AreaOfTriangle = function (v0, v1, v2)
{
    var a = new Vec3(v1.x - v0.x, v1.y - v0.y, v1.z - v0.z);
    var b = new Vec3(v2.x - v0.x, v2.y - v0.y, v2.z - v0.z);

    var x = a.y * b.z - a.z * b.y;
    var y = a.z * b.x - a.x * b.z;
    var z = a.x * b.y - a.y * b.x;

    return Math.sqrt(x*x+y*y+z*z)/2
}