import shlex

class Terrain:
    def __init__(self):
        self.name = ""
        self.shortName = ""
        self.moveMatrix = [0]*8
        self.defense = 0
        self.income = False
        self.repair = 0     # Write this as RepairType.None tho
        self.hideaway = False
        self.vision = 0
        self.land = True
        self.shallow = True
        self.value = False
        self.desc = ""

terrainTypes = []

# Read into memory the entire catalogue
with open("C:\\inetpub\\wwwroot\\src\\scripts\\battle\\data\\terrain_data.txt", 'r') as datafile:
    datafile.readline()

    for line in datafile.readlines():
        line = shlex.split(line)
        terrain = Terrain()

        terrain.name = line[0]
        terrain.shortName = line[1]

        for i in range(0, 8):
            terrain.moveMatrix[i] = int(line[i+2])
        
        terrain.defense = int(line[10])
        terrain.income = (line[11] == "1")
        terrain.repair = 1 if (line[12] == "G") else 2 if (line[12] == "N") else 3 if (line[12] == "A") else 0
        terrain.hideaway = (line[13] == "1")
        terrain.vision = int(line[14]) if (line[14] != "-") else 0
        terrain.land = (line[15] == "1")
        terrain.shallow = (line[16] == "1")
        terrain.value = (line[17] != "-")
        terrain.desc = line[18]

        terrainTypes.append(terrain)

valueStub = """
        _value = 0;
        get value() { return this._value; }
        set value(n) { this._value = Common.bindValue(n, 0, 99); }
"""

def tag(txt):
    return "/*" + txt + "*/"

def boolean(condition):
    return "true" if condition else "false"

def string(txt):
    return "\"" + txt + "\""

def repairType(t):
    types = ['None', 'Ground', 'Naval', 'Air']
    return "UnitClass." + types[t]

# Write it into the template, over and over, in a new file.
with open("Terrain.js", 'r') as sourcefile:
    with open("Terrain.gen.js", 'w') as newfile:

        template = ""
        inTemplate = False
        for line in sourcefile.readlines():
            if not inTemplate:
                if line.strip() != "// start":
                    newfile.write(line)
                else:
                    inTemplate = True
            else:
                # Gather the template
                if line.strip() != "// end":
                    template += line
                else:
                    break
        
        # Template gathered, only missing a closing '}'

        # Write all terrain objects
        count = -1
        for terrain in terrainTypes:
            newfile.write("\n")
            count += 1

            cast = template

            cast = cast.replace("Template", terrain.name.replace(' ', ''))
            cast = cast.replace(tag("serial"), str(count))
            cast = cast.replace(tag("land"), str(boolean(terrain.land)))
            cast = cast.replace(tag("shallow"), str(boolean(terrain.shallow)))
            cast = cast.replace(tag("name"), string(terrain.name))
            cast = cast.replace(tag("short name"), string(terrain.shortName))
            cast = cast.replace(tag("defense"), str(terrain.defense))
            cast = cast.replace(tag("income"), str(boolean(terrain.income)))
            cast = cast.replace(tag("repair"), repairType(terrain.repair))
            cast = cast.replace(tag("hideaway"), str(boolean(terrain.hideaway)))
            cast = cast.replace(tag("vision"), str(terrain.vision))
            cast = cast.replace(tag("desc"), string(terrain.desc))

            # Movement costs
            cast = cast.replace(tag("inf"), str(terrain.moveMatrix[0]))
            cast = cast.replace(tag("mch"), str(terrain.moveMatrix[1]))
            cast = cast.replace(tag("trA"), str(terrain.moveMatrix[2]))
            cast = cast.replace(tag("trB"), str(terrain.moveMatrix[3]))
            cast = cast.replace(tag("trd"), str(terrain.moveMatrix[4]))
            cast = cast.replace(tag("air"), str(terrain.moveMatrix[5]))
            cast = cast.replace(tag("shp"), str(terrain.moveMatrix[6]))
            cast = cast.replace(tag("trp"), str(terrain.moveMatrix[7]))

            if (terrain.value):
                cast = cast.replace(tag("value"), valueStub)
            else:
                cast = cast.replace(tag("value"), "")

            newfile.write(cast)

        newfile.write('}')