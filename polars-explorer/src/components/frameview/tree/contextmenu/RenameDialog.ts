export default function RenameDialog(type: string = "frame") {
    let newName = prompt(`New name for this ${type}:`)
    while (!newName || !newName.trim()) {
        newName = prompt("Please enter a non-empty name:")
    }
    return newName;
}