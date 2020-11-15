export function update_attr<Type, Key extends keyof Type>( dest_data : Type, data : Type, key : Key[] )
{
    key.map( (key) => {
        if ( data[key] !== undefined )
        {
            dest_data[key] = data[key];
        }
    } )
}