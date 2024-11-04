import { SelectContent } from "@radix-ui/react-select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

function FormControls ({formControls = [], formData,  setFormData}) {

    function renderComponentByType (getControlItem) {
        let element = null;
        const currentControlItemValue = formData[getControlItem.name || '']
        switch (getControlItem.componentType) {
            case 'input':
                element = <Input
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type={getControlItem.type}
                value={currentControlItemValue}
                onChange={(even) => setFormData({
                    ...formData,
                    [getControlItem.name] : event.target.value
                })}
                />
                break;
            case 'select':
                element = 
                <Select
                onValueChange={(value)=> setFormData({
                    ...formData,
                    [getControlItem.name] : value
                })}
                value={currentControlItemValue}
                >
                    <SelectTrigger classNamew="w-full">
                        <SelectValue
                        placeholder={getControlItem.label}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            getControlItem.options && getControlItem.options.length > 0 ?
                            getControlItem.options.map(optionItem => <SelectItem key={optionItem.id} value={optionItem.id}>{optionItem.label}</SelectItem>) : null
                        }
                    </SelectContent>
                </Select>
                break;
            case 'textarea':
                element = <Textarea
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                value={currentControlItemValue}
                onChange={(even) => setFormData({
                    ...formData,
                    [getControlItem.name] : event.target.value
                })}
                />
                break;
            default:
                element = <Input 
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type={getControlItem.type}
                value={currentControlItemValue}
                onChange={(even) => setFormData({
                    ...formData,
                    [getControlItem.name] : event.target.value
                })}
                />
                break;
        }

        return element;
    }

    return(
        <div className="flex flex-col gap-3">
            {
                formControls.map(controlItem => 
                    <div key={controlItem.name}>
                        <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
                        {
                            renderComponentByType(controlItem)
                        }
                    </div>
                )
            }
        </div>
    )
}

export default FormControls;